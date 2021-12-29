import requests


def download_binary(source_url: str, local_path: str, chunk_size: int):
    r = requests.get(source_url, stream=True)
    with open(local_path, 'wb') as f:
        for chunk in r.iter_content(chunk_size=chunk_size):
            if chunk:
                f.write(chunk)
