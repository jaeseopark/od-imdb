import logging
import os
import sqlite3
from os.path import exists, basename
from time import perf_counter
from typing import List

from od_imdb.util.download import download_binary

_CHUNK_SIZE = 1024
_ALLOWED_TITLE_TYPES = ("tvSeries", "movie")
_INIT_STATEMENT = """
CREATE TABLE movies (
  movie_id NUMERIC PRIMARY KEY,
  title_type TEXT NOT NULL,
  primary_title TEXT NOT NULL,
  original_title TEXT NOT NULL,
  is_adult NUMERIC,
  year NUMERIC,
  end_year NUMERIC,
  runtime_minutes NUMERIC,
  genre TEXT,
  rating NUMERIC,
  votes NUMERIC
);
CREATE VIRTUAL TABLE fuzzy USING FTS5 (
  movie_id,
  title
);
"""

LOGGER = logging.getLogger(__name__)


def _download_then_unzip(url: str, tsv_path: str, base_path: str):
    tmp_path = os.path.join(base_path, basename(url))
    download_binary(url, tmp_path, _CHUNK_SIZE)
    raise NotImplementedError


def get_basics(path: str):
    with open(path, encoding="utf-8") as fp:
        next(fp)  # skip the first line of the file (ie. header line)
        for line in fp.readlines():
            line_split = line.split("\t")
            if line_split[1] in _ALLOWED_TITLE_TYPES:
                yield line_split


def get_ratings(path: str):
    with open(path, encoding="utf-8") as fp:
        next(fp)  # skip the first line of the file (ie. header line)
        for line in fp.readlines():
            line_split = line.split("\t")
            yield (
                line_split[1],  # ratings
                line_split[2],  # votes
                line_split[0],  # id
            )


def get_fuzzy_title(attributes: List[str]) -> str:
    title = attributes[2]
    year = attributes[5]
    end_year = attributes[6]

    if year != "\\N":
        title += f" {year}"
    if end_year != "\\N":
        title += f"-{end_year}"
    return title


def init_sqlite(base_path: str, sqlite_path: str, **kwargs):
    LOGGER.info("Start")
    start = perf_counter()

    basics_tsv = os.path.join(base_path, "basics.tsv")
    ratings_tsv = os.path.join(base_path, "ratings.tsv")

    if not (exists(basics_tsv) and exists(ratings_tsv)):
        raise NotImplementedError

    movies = get_basics(basics_tsv)
    ratings = get_ratings(ratings_tsv)

    con = sqlite3.connect(sqlite_path)
    con.executescript(_INIT_STATEMENT)

    with con as conn:
        for movie in movies:
            conn.execute("INSERT INTO movies VALUES (?,?,?,?,?,?,?,?,?,NULL,NULL)", movie)
            fuzzy_movie = (movie[0], get_fuzzy_title(movie))
            conn.execute("INSERT INTO fuzzy VALUES (?,?)", fuzzy_movie)

        conn.executemany("UPDATE movies SET rating = ?, votes = ? WHERE movie_id = ?", ratings)
        conn.execute("UPDATE movies SET year = NULL WHERE year = '\\N'")
        conn.execute("UPDATE movies SET end_year = NULL WHERE end_year = '\\N'")
        conn.execute("UPDATE movies SET runtime_minutes = NULL WHERE runtime_minutes = '\\N'")
        conn.execute("UPDATE movies SET genre = NULL WHERE genre = '\\N\n'")
        conn.execute("UPDATE movies SET genre = TRIM(genre, '\n') WHERE genre IS NOT NULL")

    con.close()

    elapsed = perf_counter() - start
    LOGGER.info(f"End {elapsed=}")
