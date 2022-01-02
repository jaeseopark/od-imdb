from abc import ABC, abstractmethod
from typing import List

from od_imdb.repository.error import RepositoryUpdatingError
from od_imdb.interface import OdFileEntity


def disallowed_while_updating(func):
    def inner_wrapper(self, *args, **kwargs):
        # Note: not thread safe, but not the end of the world.
        if self.is_updating:
            raise RepositoryUpdatingError
        return func(self, *args, **kwargs)

    return inner_wrapper


class Repository(ABC):
    @abstractmethod
    def decorate(self, entities: List[OdFileEntity]):
        pass

    @abstractmethod
    def close(self):
        pass


class UpdatableRepository(Repository):
    def __init__(self, is_updating: bool = False):
        self.is_updating = is_updating

    @disallowed_while_updating
    def decorate(self, entities: List[OdFileEntity]):
        return self.decorate_safe(entities)

    def update(self):
        self.is_updating = True
        self.update_safe()
        self.is_updating = False

    @abstractmethod
    def decorate_safe(self, entities: List[OdFileEntity]):
        pass

    @abstractmethod
    def update_safe(self):
        pass
