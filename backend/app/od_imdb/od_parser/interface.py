from abc import ABC, abstractmethod
from enum import Enum
from typing import List

import requests

from od_imdb.interface import OdFileEntity


class OdParserMode(Enum):
    PARSE_HTML = "PARSE_HTML"
    PARSE_URL = "PARSE_URL"
    PARSE_ALL = "PARSE_ALL"


class OdParser(ABC):
    def __init__(self, mode: str):
        self.mode: OdParserMode = OdParserMode[mode]

    def parse_url(self, url: str) -> List[OdFileEntity]:
        if self.mode == OdParserMode.PARSE_HTML:
            raise ValueError("parse_url is currently disabled")

        r = requests.get(url)
        r.raise_for_status()
        return self.parse_html(r.text)

    def parse_html(self, html: str) -> List[OdFileEntity]:
        if self.mode == OdParserMode.PARSE_URL:
            raise ValueError("parse_html is currently disabled")

        return self.parse_html_safe(html)

    @abstractmethod
    def parse_html_safe(self, html: str) -> List[OdFileEntity]:
        pass
