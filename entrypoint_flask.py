import json
import logging
from dataclasses import is_dataclass, asdict
from typing import Union

from flask import Flask, request

from od_imdb.od_imdb import OdImdb

logging.basicConfig(format="%(asctime)s %(levelname)s thread=%(thread)d %(module)s.%(funcName)s %(message)s")
logging.root.setLevel(logging.INFO)

# TODO: add logging.FileHandler

LOGGER = logging.getLogger(__name__)


class NestedNonNullEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, dict):
            return {k: self.default(v) for k, v in o.items() if v is not None}
        elif isinstance(o, list):
            return [self.default(i) for i in o if i is not None]
        elif is_dataclass(o):
            return {k: self.default(v) for k, v in asdict(o).items() if v is not None}
        return o


def normalize(payload: Union[dict, list]):
    return json.loads(json.dumps(payload, cls=NestedNonNullEncoder))


def main():
    od_imdb = OdImdb()
    app = Flask(__name__)

    @app.get("/lookup")
    def lookup():
        url: str = request.args.get("url")
        try:
            entities = od_imdb.lookup(url)
            return normalize({"entities": entities}), 200
        except ValueError as e:
            return {"message": str(e)}, 400
        except Exception:
            LOGGER.exception("")
            return {"message": "unknown error"}, 500

    @app.post("/update")
    def update():
        # TODO: async mode
        od_imdb.update()
        return "", 200

    try:
        app.run(port=2014)
    except KeyboardInterrupt:
        od_imdb.repository.close()


if __name__ == '__main__':
    main()
