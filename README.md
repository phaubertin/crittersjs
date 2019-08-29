# Crittersjs #

Critters must catch food (green circles) and avoid dangers (red squares). The 
brain of each critter is a small feedforward neural network. Brains are trained 
using a genetic algorithm to simulate evolution. Every 20 seconds, the five 
best critters of the latest generation are sent to the simulation running in 
the graphical user interface (GUI).

This is a JavaScript port of my [critters project written in C](https://github.com/phaubertin/critters).

**Work in progress**: the port is in progress. For now, the critters use hardcoded
weights generated with the C project.

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

Open the **target/index.html** file in your web browser.
