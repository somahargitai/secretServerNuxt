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

Then you can reach the services on the URLs above.
## Limitations

- Due to Mongo Database behaviour, TTL is not accurate. Above the given time limit, data may live for additional 30-60 seconds.
- As it is a demo project, I have added expiration and view limits. Even if API is permissive, frontend expects you to avoid time limit above 5000 minutes and view limit above 20.

## Alternate running options

If you would like to connect to your own database, you should set database connection in `/api/config/keys.js`.

If you want to run it without docker-compose, use Dockerfile directly:

```console
 docker build -t secretserver
 docker run -it -p 5000:5000 secretserver
```

## API endpoints

Three endpoints are available: 
- GET`http://localhost:5000/api/` provides a healthcheck
- GET `http://localhost:5000/api/secret/{hash}` responds with the secret object for the given hash
- POST `http://localhost:5000/api/secret/` creates a new secret and responds with the object created. The following properties should be provided:

```JSON
  {
    "secret": "[This text that will be saved as a secret]",
    "expireAfterViews": "[The secret won't be available after the given number of views]",
    "expireAfter": "[The secret won't be available after the given time. The value is provided in minutes. 0 means never expires]"
}
```

Response structure:

```JSON
{
  "hash": "[The hash of the string]",
  "secretText": "[The original text]",
  "createdAt": "[The Timestamp the secret was created]",
  "expiresAt": "[The Timestamp the secret if TTL is given]",
  "remainingViews": 0
}
```
