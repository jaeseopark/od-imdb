# od-imdb

Scans an Open Directory containing movies and looks them up on IMDB.

<img src="https://user-images.githubusercontent.com/20038316/147903087-0b19f02f-add9-4225-b802-56751af1ddda.gif" width="500" />

## Installation

1. Install [`docker`](https://docs.docker.com/get-docker/) and [`docker-compose`](https://docs.docker.com/compose/install/).
1. Run (UNIX):
    ```bssh
    wget https://raw.githubusercontent.com/jaeseopark/od-imdb/master/docker-compose-production.yml docker-compose.yml
    docker-compose up -d
    ```
1. (Optional) Install the Chrome extension in `browser-extension/`.

## Advanced Usage

### Update Repository

```bash
curl --request POST "http://localhost:2014/api/update"
```

### Use Third Party API

Using a well-established third party API for the lookup will improve a number of things such as:
* the relevance of the search results;
* the latency of the search; and
* the access to recently released titles.

TODO: write about https://imdb-api.com/

### Custom Modules

You can bring your own implementations of `OdParser`, `Repository`, or `UpdatableRepository`:

```bash
pip install od-imdb
```

```python
from typing import List

from od_imdb.repository.interface import Repository
from od_imdb.interface import OdFileEntity
from od_imdb.od_imdb import OdImdb
from od_imdb.od_parser.interface import OdParser

class MyCustomParser(OdParser):
   def get_entities(self, url: str) -> List[OdFileEntity]:
      return [...]

class MyCustomRepository(Repository):
   def decorate_safe(self, entities: List[OdFileEntity]):
      for entity in entities:
         my_awesome_lookup_algorithm(entity)

custom_parser = MyCustomParser()
custom_repo = MyCustomRepository()
od_imdb = OdImdb(od_parser=custom_parser, repository=custom_repo)

od_imdb.lookup("http://foo.bar/folder123/")
```

## Development

```bash
docker-compose up --build
```
