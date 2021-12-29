from od_imdb.repository.self_hosted.sqlite.sqlite import Sqlite
from od_imdb.repository.third_party.imdb_api import ImdbApi

_REPO_MAP = {
    "imdb-api": ImdbApi,
    "sqlite": Sqlite
}


def get_repository(config: dict):
    active: str = config["active"]
    if active not in _REPO_MAP or active not in config:
        raise ValueError(f"Invalid data source: {active}")
    return _REPO_MAP[active](**config[active])
