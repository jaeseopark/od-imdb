from typing import List

from htmllistparse import fetch_listing

from od_imdb.interface import OdFileEntity
from od_imdb.od_parser.interface import OdParser


class OdHtmlParser(OdParser):
    def get_entities(self, url: str) -> List[OdFileEntity]:
        _, listings = fetch_listing(url)
        return [OdFileEntity(
            name=listing.name,
            parent_url=url,
            is_directory=listing.name.endswith("/")
        ) for listing in listings]
