# od-imdb

Scans an Open Directory containing movies and looks them up on IMDB.

TODO: insert a gif here.

## Installation

1. Install [`docker`](https://docs.docker.com/get-docker/) and [`docker-compose`](https://docs.docker.com/compose/install/).
1. Run (UNIX):
    ```bssh
    mkdir ~/od-imdb; cd ~/od-imdb
    mkdir mnt; touch mnt/log.log

    cat > docker-compose.yml <<EOF
    # TODO docker compose content
    EOF

    docker-compose up -d
    ```
1. Install the following Google Chrome extension: TODO: publish the extension

## Advanced Usage

### Update Repository

```bash
curl --request POST "http://localhost:2014/update"
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
         entity.movie = my_awesome_lookup_algorithm(entity.name)


custom_parser = MyCustomParser()
custom_repo = MyCustomRepository()
od_imdb = OdImdb(od_parser=custom_parser, repository=custom_repo)

od_imdb.lookup("http://foo.bar/folder123/")
```
