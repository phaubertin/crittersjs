# Crittersjs #

Critters must catch food (green circles) and avoid dangers (red squares). The 
brain of each critter is a small feedforward neural network. Brains are trained 
using a genetic algorithm to simulate evolution. Every 10 seconds, the five 
best critters of the latest generation are sent to the simulation rendered on 
the web page.

This is a TypeScript port of my [critters project written in C](https://github.com/phaubertin/critters).

![Screenshot](https://raw.githubusercontent.com/phaubertin/crittersjs/master/doc/screenshot.png)

Build Requirements
------------------

This project uses `npm` to install dependencies and perform the build.

Runtime Requirements
--------------------

The only runtime requirement is a web browser.

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

If you are using a web browser other than Google Chrome, running the application
is probably as simple as opening the **target/index.html** file in your browser.

The issue with running this application in Chrome is that it does not allow
running a web worker from a local file. A possible workaround is to start
Chrome with the ``--allow-file-access-from-files`` argument. The ``run-with-chrome``
bash script at the top of the repository does this for you. For this workaround
to work, all Chrome windows have to be closed beforehand.

Alternatively, the application can be served with any HTTP server so the
web worker's code is no longer a local file. For example, if you have Python 3
installed, simply change into the **target** directory and start the built in
HTTP server, then point your web browser to ``localhost:8000``.
```
cd target
python -m http.server
```

More detail and other possible workarounds can be found in [this Stack Overflow question](https://stackoverflow.com/questions/21408510/chrome-cant-load-web-worker).
