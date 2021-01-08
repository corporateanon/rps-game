# Rock-Paper-Scissors Game

CLI and REST application for Rock-Scissors-Paper game.

## Installation

Requirement: Node.js 14+

```
npm i -g @tmp-evaluation-tasks/rps-game
```

## Usage

To run CLI-version, type the following command:

```
rps-game
```

If you have a Redis server, running at localhost, you can enable Redis storage, by adding `REDIS=localhost` environment variable before the command:

```
REDIS=localhost rps-game
```

Follow the hints in the terminal to play the game.

There is also another implementation, built as a web-server with RESTful API.

To run RESTful API server, type the following command:

```
rps-game-server
```

If you have a Redis server, running at localhost, you can enable Redis storage, by adding `REDIS=localhost` environment variable before the command:

```
REDIS=localhost rps-game-server
```


To test the API, you need 2 commands:

**Start the game**

```
curl -i -b ./cookies.txt -c ./cookies.txt -X POST http://127.0.0.1:3000/start
```

**Make a choice**

```sh
#Any of the following:
curl -i -b ./cookies.txt -c ./cookies.txt -X POST http://127.0.0.1:3000/choice/scissors
#Or:
curl -i -b ./cookies.txt -c ./cookies.txt -X POST http://127.0.0.1:3000/choice/rock
#Or:
curl -i -b ./cookies.txt -c ./cookies.txt -X POST http://127.0.0.1:3000/choice/paper

```

Also you can test the API using a simple web-interface at http://127.0.0.1:3000 .

The API **is** stetefull, it means that you have to `/start` each time in order to make computer make its choice.

Game session (a state of current game, computer's choice and so on) is stored in Express session (that's why, if you need to test the API, you have to use a client supporting cookies).

The scoreboard is stored in a separate storage (memory or Redis, depending on the value of `REDIS` environment variable), which is global and has only one instance.

## Development

### CLI

To build it locally, clone this repo and run:

```
npm ci
npm run build
npm start
```

### REST

```
npm ci
npm run dev:rest
```
