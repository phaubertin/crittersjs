# Crittersjs #

Critters must catch food (green circles) and avoid dangers (red squares). The 
brain of each critter is a small feedforward neural network. Brains are trained 
using a genetic algorithm to simulate evolution. Every 10 seconds, the five 
best critters of the latest generation are sent to the simulation rendered on 
the web page.

This is a JavaScript port of my [critters project written in C](https://github.com/phaubertin/critters).

![Screenshot](https://raw.githubusercontent.com/phaubertin/crittersjs/master/doc/screenshot.png)

Build Requirements
------------------

The build process requires the [Google Closure Compiler](https://developers.google.com/closure/compiler/),
which is a JavaScript-to-JavaScript compiler/minifier. The latest version can be downloaded
[here](https://github.com/google/closure-compiler/wiki/Binary-Downloads).

Google Closure Compiler requires Java 8 to run.

The build process also requires GNU make installed on your system.

Runtime Requirements
--------------------

The only runtime requirement is a web browser.

Build Instructions
------------------

Download the latest Google Closure Compiler from 
Download the latest Google Closure Compiler from [here](https://dl.google.com/closure-compiler/compiler-latest.zip) (.zip)
or [here](https://dl.google.com/closure-compiler/compiler-latest.tar.gz) (.tar.gz)
and extract the downloaded .zip or .tar.gz file into the **closure/** directory. The
compiler itself is a .jar file with a name similar to closure-compiler-v20190819.jar
(the date may be different).
```
cd closure
wget https://dl.google.com/closure-compiler/compiler-latest.tar.gz
tar -xzf compiler-latest.tar.gz
cd ..
```
Change to the repository's top directory and run make:
```
make
```
This command invokes the compiler with the correct arguments. The generated
files are placed in the **target/** directory.

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
