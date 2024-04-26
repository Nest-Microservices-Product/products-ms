# Product Microservice

## Dev

1. Clone the repository
2. Install the dependencies
3. Create a file `.env` based on `env.template`
4. Run the following command to run the migrations of prisma`npx prisma migrate dev`
5. Raise the NATS server

```
$ docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```

6. Run the command `npm run start:dev`

## PROD

Run the following command

```
docker build -f dockerfile.prod -t product-ms .
```

## If you want the latest version of the service

```
docker pull fernandoflores07081/products-ms-prod
```
