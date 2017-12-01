"use strict";

// Global var
let mouseInputMode = 0;
let agents = [];

function setup()
{
	// Canvas setup
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("p5Container");
	// Detect screen density (retina)
	var density = displayDensity();
	pixelDensity(density);

	randomSeed(options.randomSeed);

	for(let i = 0; i < options.numberOfAgents; i++)
	{
		let agent = new Agent(
						random(0, windowWidth),
						random(0, windowHeight)
					);

		agents.push(agent);
	}

	background(options.backgroundColor);
}

function draw()
{
	if (window.somethingChanged)
	{
		// setup
		randomSeed(options.randomSeed);
		agents = [];

		for(let i = 0; i < options.numberOfAgents; i++)
		{
			let agent = new Agent(
							random(0, windowWidth),
							random(0, windowHeight)
						);

			agents.push(agent);
		}

		// draw
		background(options.backgroundColor);

		fill(options.agentColor);
		agents.forEach( function ( element, index, arr)
		{
			element.drawLocation();
		});

		window.somethingChanged = false;
	}

	switch (mouseInputMode)
	{
		case 0:
			window.somethingChanged = false;
		break;
		case 1:
			window.somethingChanged = true;
		break;
		default:
			window.somethingChanged = true;
		break;
	}
}

function keyPressed()
{
	if (key == 's' || key == 'S') saveThumb(650, 350);
	if (key == ' ')
	{
		mouseInputMode ++;
		if (mouseInputMode > 1)
		{
			mouseInputMode = 0;
		}
	}
	if (key == 'd' || key == 'D')
	{
	}
	if (key == 'a' || key == 'A')
	{
	}
}

class Agent
{
	constructor(pointX, pointY)
	{
		this.location = createVector(pointX, pointY);
	}

	drawLocation()
	{
		point(this.location.x, this.location.y);
	}
}

// Tools

// resize canvas when the window is resized
function windowResized()
{
	resizeCanvas(windowWidth, windowHeight, false);
	window.somethingChanged = true;
}

// Int conversion
function toInt(value)
{
	return ~~value;
}

// Timestamp
function timestamp()
{
	return Date.now();
}

// Thumb
function saveThumb(w, h)
{
	let img = get( width/2-w/2, height/2-h/2, w, h);
	save(img,'thumb.jpg');
}