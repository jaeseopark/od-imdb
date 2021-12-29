from abc import ABC, abstractmethod
from typing import List

from od_imdb.interface import OdFileEntity


class OdParser(ABC):
    @abstractmethod
    def get_entities(self, url: str) -> List[OdFileEntity]:
        pass
