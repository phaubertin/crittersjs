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
