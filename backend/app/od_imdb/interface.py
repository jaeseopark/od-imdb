from dataclasses import dataclass, field
from typing import List


@dataclass
class OdFileEntity:
    name: str
    is_directory: bool
    timestamp_ms: int  # posix timestamp in milliseconds
    size: int = field(default=None)  # in bytes

    # Movie attributes
    title: str = field(default=None)
    rating: int = field(default=None)
    votes: int = field(default=None)
    year: int = field(default=None)
    end_year: int = field(default=None)
    genre: List[str] = field(default=None)
    runtime_minutes: int = field(default=None)
    external_link: str = field(default=None)

    def __post_init__(self):
        self.name = self.name.rstrip("/")
