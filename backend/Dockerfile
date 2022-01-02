FROM tiangolo/uwsgi-nginx-flask:python3.10

WORKDIR /app

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY app ./
