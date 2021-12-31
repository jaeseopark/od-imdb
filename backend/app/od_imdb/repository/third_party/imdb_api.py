from typing import List

from od_imdb.repository.interface import Repository
from od_imdb.interface import OdFileEntity


class ImdbApi(Repository):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def decorate(self, entities: List[OdFileEntity]):
        raise NotImplementedError

    def close(self):
        pass
