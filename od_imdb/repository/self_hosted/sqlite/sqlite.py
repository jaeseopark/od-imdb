import os
import re
import sqlite3
from os.path import exists
from typing import List

from commmons import touch_directory

from od_imdb.interface import OdFileEntity, Movie
from od_imdb.repository.interface import UpdatableRepository
from od_imdb.repository.self_hosted.sqlite.initializer import init_sqlite

_SQLITE_BASENAME = "db.sqlite"
_FIELDS_TO_RETURN = ("primary_title", "rating", "votes", "year", "end_year", "genre")


def _dict_factory(cursor, row):
    dct = {col[0]: row[idx] for idx, col in enumerate(cursor.description)}
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
                fuzzy_statement = "SELECT m.* FROM fuzzy(?) f INNER JOIN movies m ON m.movie_id = f.movie_id ORDER BY rank, votes"
                fuzzy_name = re.sub(r"[^a-zA-Z0-9]", " ", entity.name)
                for row in con.execute(fuzzy_statement, (fuzzy_name,)):
                    entity.movie = Movie(*[row.get(field) for field in _FIELDS_TO_RETURN])
                    break

    def update_safe(self):
        os.remove(self.sqlite_path)

        raise NotImplementedError

    def close(self):
        try:
            self.con.close()
        except Exception:
            # TODO: log and move on
            pass
