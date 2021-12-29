import logging
from typing import List

from od_imdb.config import get_default_config
from od_imdb.repository.error import RepositoryUpdatingError
from od_imdb.repository.factory import get_repository
from od_imdb.repository.interface import Repository, UpdatableRepository
from od_imdb.interface import OdFileEntity
from od_imdb.od_parser.html import OdParser, OdHtmlParser

_DEFAULT_OD_PARSER_CLS = OdHtmlParser

LOGGER = logging.getLogger(__name__)


class OdImdb:
    def __init__(self, od_parser: OdParser = None, repository: Repository = None):
        config = get_default_config()
        if not od_parser:
            od_parser = _DEFAULT_OD_PARSER_CLS()
        if not repository:
            repository = get_repository(config["repository"])

        self.od_parser = od_parser
        self.repository = repository

    def lookup(self, url: str) -> List[OdFileEntity]:
        entities = self.od_parser.get_entities(url)

        try:
            self.repository.decorate(entities)
        except RepositoryUpdatingError:
            # Swallow the exception and move on. Database will come back online in a few seconds.
            pass
        return entities

    def update(self):
        if isinstance(self.repository, UpdatableRepository):
            self.repository.update()
