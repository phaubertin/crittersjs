# Crittersjs #

Critters must catch food (green circles) and avoid dangers (red squares). The 
brain of each critter is a small feedforward neural network. Brains are trained 
using a genetic algorithm to simulate evolution. Every 10 seconds, the five 
best critters of the latest generation are sent to the simulation rendered on 
the web page.

See [the demo](https://phaubertin.github.io/crittersjs).

This is a TypeScript port of my [original critters project](https://github.com/phaubertin/critters)
written in C.

![Screenshot](https://raw.githubusercontent.com/phaubertin/crittersjs/master/doc/screenshot.png)

Build Requirements
------------------

This project uses `npm` to install dependencies and perform the build.

Runtime Requirements
--------------------

A web browser is required.

Node.js is also required to start the server for local testing.

Build Instructions
------------------

First, install the build depencies:

```
npm install --include=dev
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

Run Instructions
------------------

Once built, the `dist/` directory contains the complete demo as a single web
page (`index.html`) that loads the necessary script. One complication to keep
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
