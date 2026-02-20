# Crittersjs #

See [the demo](https://phaubertin.github.io/crittersjs).

Critters must catch food (green circles) and avoid dangers (red squares). The 
brain of each critter is a small feedforward neural network. Brains are trained 
using a genetic algorithm to simulate evolution. The five best critters of the latest generation are sent to the simulation rendered on the web page periodically.

This is a TypeScript port of my [original critters project](https://github.com/phaubertin/critters)
written in C.

![Screenshot](https://raw.githubusercontent.com/phaubertin/crittersjs/master/doc/screenshot.png)

Try it!
-------

If you want to see this project in action without building anything, you have two options...

### Demo on GitHub Pages

See [the demo](https://phaubertin.github.io/crittersjs) hosted on GitHub Pages.

### Container Image from Public Registry

If you have Docker installed, you can pull the pre-built image from a public container registry:

```
docker pull ghcr.io/phaubertin/crittersjs
```

Start the container as follow:

```
docker run -d -p8080:80 --name crittersjs ghcr.io/phaubertin/crittersjs
```

Then, navigate with your web browser of choice to [http://127.0.0.1:8080](http://127.0.0.1:8080).

Build Requirements
------------------

This project uses `npm` to install dependencies and perform the build.

In order to build the container (optional), Docker is required.

Runtime Requirements
--------------------

A web browser is required.

Node.js is required to start the server for local testing. Alternatively, if you want to run the container, Docker is required instead.

Build Instructions
------------------

First, install the build depencies:

```
npm install
```

Then, build the project:

```
npm run build
```

Output files are placed in the `dist/` directory:

* `critters.js` is the main JavaScript file.
* `critters-worker.js` contains the code for the worker. No need to directly
   reference this one in any HTML file, but it is referenced by `critters.js`.
* Other files (HTML, CSS, etc.) are copied from the `static/` directory.

Finally, you can build the Docker container (optional):

```
docker build -t crittersjs .
```

Run Instructions
------------------

### Running from the Container

If you built the container, you can run it as follow:

```
docker run -d -p8080:80 --name crittersjs crittersjs
```

Then, navigate with your web browser of choice to [http://127.0.0.1:8080](http://127.0.0.1:8080).

### Running without the Container

Once built, the `dist/` directory contains the complete demo as a single web
page (`index.html`) that loads the necessary script. One complication to keep
in mind for local testing, however, is that some web browsers do not allow
running a worker from a script loaded from a local file. See
[this Stack Overflow question](https://stackoverflow.com/questions/21408510/chrome-cant-load-web-worker)
for some more context.

The easiest option for local testing is to run the following:

```
npm run start
```

This starts a web server locally on port `8080` that serves the files from the
`dist/` directory, and then opens your default web browser at the right address.
This requires a local installation of Node.js for the server.

If you prefer only starting the server and then opening your web browser yourself,
run the following command instead:

```
npm run server
```

Then, navigate with your web browser of choice to [http://127.0.0.1:8080](http://127.0.0.1:8080).
