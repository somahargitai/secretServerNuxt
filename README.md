# Secret Server

This project is a Secret Server. You can save a secret text and get it back by its hash. After a given number of views and a given time it won't be available.

## Project structure

This is a Nuxt Project. Next to the Vue frontend an API runs on the same web server. A Mongo Database is added to the project with Docker Compose.

- Frontend runs on: `http://localhost:5000/`
- API runs on `http://localhost:5000/api`
- Mongo DB runs on: `http://localhost:27017/`

## Usage

You have to install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/). Then from the project folder run:

```console
docker-compose up
```

### Notes

If you would like to connect to your own database, you should set database connection in `/api/config/keys.js`.

If you want to run it without docker-compose, use Dockerfile directly:

```console
 docker build -t secretserver
 docker run -it -p 5000:5000 secretserver
```
