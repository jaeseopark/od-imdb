from dataclasses import dataclass, field
from typing import List


@dataclass
class Movie:
    name: str
    rating: int
    votes: int
    year: int
    end_year: int
    genre: List[str]


@dataclass
class OdFileEntity:
    name: str
    parent_url: str
    is_directory: bool

    movie: Movie = field(default=None)

    def __post_init__(self):
        self.name = self.name.rstrip("/")
