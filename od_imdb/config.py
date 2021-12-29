import io

import yaml

_DEFAULT = """
repository:
  active: sqlite
  sqlite:
    path: tmp # /shared
    basic_url: https://datasets.imdbws.com/title.basics.tsv.gz
    ratings_url: https://datasets.imdbws.com/title.ratings.tsv.gz
  imdb-api:
    api_key: ""
"""


def get_default_config():
    with io.StringIO(_DEFAULT) as fp:
        return yaml.safe_load(fp)
