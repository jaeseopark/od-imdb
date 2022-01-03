import os
import sqlite3
from os.path import exists
from typing import List

from commmons import touch_directory

from od_imdb.interface import OdFileEntity
from od_imdb.repository.interface import UpdatableRepository
from od_imdb.repository.self_hosted.sqlite.initializer import init_sqlite

_SQLITE_BASENAME = "db.sqlite"
_FIELDS_TO_DECORATE = ("title", "rating", "votes", "year", "end_year", "genre", "runtime_minutes", "external_link")
FUZZY_STATEMENT = "SELECT m.* FROM fuzzy(?) f INNER JOIN movies m ON m.movie_id = f.movie_id ORDER BY rank, votes LIMIT 1"


def _dict_factory(cursor, row):
    dct = {col[0]: row[idx] for idx, col in enumerate(cursor.description)}
    dct["title"] = dct.pop("primary_title")
    dct["external_link"] = f"https://www.imdb.com/title/{dct['movie_id']}/"
    if dct["genre"]:
        dct["genre"] = dct["genre"].split(",")
    return dct


class Sqlite(UpdatableRepository):
    def __init__(self, path: str, **config):
        super().__init__()
        touch_directory(path)
        self.base_path = path
        self.sqlite_path = os.path.join(path, _SQLITE_BASENAME)

        if not exists(self.sqlite_path):
            init_sqlite(self.base_path, self.sqlite_path, **config)
        self.con = sqlite3.connect(self.sqlite_path, check_same_thread=False)
        self.con.row_factory = _dict_factory

    def decorate_safe(self, entities: List[OdFileEntity]):
        with self.con as con:
            for entity in entities:
                if not entity.sanitized_name:
                    continue
                for row in con.execute(FUZZY_STATEMENT, (entity.sanitized_name,)):
                    for field_name in _FIELDS_TO_DECORATE:
                        setattr(entity, field_name, row[field_name])

    def update_safe(self):
        raise NotImplementedError

    def close(self):
        try:
            self.con.close()
        except Exception:
            # TODO: log and move on
            pass
