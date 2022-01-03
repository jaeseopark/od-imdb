from dataclasses import dataclass, field
import re
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

    _sanitized_name: str = field(default=None)

    def __post_init__(self):
        self.name = self.name.rstrip("/")

    @property
    def sanitized_name(self):
        def sanitize():
            tokens = [s for s in re.sub(r"[^a-zA-Z0-9]", " ", self.name).split(" ") if s]
            found_year = False
            for i, token in enumerate(tokens):
                is_year = False
                if token.isdigit():
                    is_year = 1900 < int(token) < 2100
                if not is_year and found_year:
                    return " ".join(tokens[:i])
                if is_year:
                    found_year = True

            return " ".join(tokens)

        if not self._sanitized_name:
            self._sanitized_name = sanitize()

        return self._sanitized_name
