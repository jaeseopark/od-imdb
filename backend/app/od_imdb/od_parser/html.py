from time import mktime
from typing import List

import bs4
from htmllistparse import parse

from od_imdb.interface import OdFileEntity
from od_imdb.od_parser.interface import OdParser


class OdHtmlParser(OdParser):
    def parse_html_safe(self, html: str) -> List[OdFileEntity]:
        soup = bs4.BeautifulSoup(html, 'html5lib')
        _, listings = parse(soup)
        return [OdFileEntity(
            name=listing.name,
            is_directory=listing.name.endswith("/"),
            timestamp_ms=int(mktime(listing.modified) * 1000),
            size=listing.size
        ) for listing in listings]
