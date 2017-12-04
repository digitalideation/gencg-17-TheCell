"use strict";

// Global var
let mouseInputMode = 0;
//let cycleInterval;
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
						random(0, windowHeight),
						15
					);

		agents.push(agent);
	}

	/*
	cycleInterval = window.setInterval( function ()
	{
		agents.forEach( function ( element, index, arr)
		{
			element.walkCycle();
		});

		window.somethingChanged = true;
	}, 1000);
	*/

	background(options.backgroundColor, options.backgroundAlpha);
}

function draw()
{
	if (window.somethingChanged)
	{
		// draw
		background(
			options.backgroundColor[0],
			options.backgroundColor[1],
			options.backgroundColor[2],
			options.backgroundAlpha);
		stroke(color(options.agentColor));
		strokeWeight(options.agentFatness);
		fill(options.agentColor);
		agents.forEach( function ( element, index, arr)
		{
			element.drawLocation();
		});

		let amountKilled = cleanDeadAgents(agents);
		for (let i = 0; i < amountKilled; i++)
		{
			let agent = new Agent(
				random(0, windowWidth),
				random(0, windowHeight));

			agents.push(agent);
		}

		window.somethingChanged = false;
	}

	switch (mouseInputMode)
	{
		case 0:
			window.somethingChanged = true;
		break;
		case 1:
			window.somethingChanged = true;
		break;
		default:
			window.somethingChanged = true;
		break;
	}

	agents.forEach( function ( element, index, arr)
	{
		element.updateCycle();
	});
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

function cleanDeadAgents(arrayWithAgents)
{
	let killCount = 0;

	arrayWithAgents.forEach( function(element, index, arr)
	{
		if (!element.agentAlive)
		{
			arr.splice(index, 1);
			killCount ++;
		}
	});

	return killCount;
}

class Agent
{
	constructor(pointX, pointY)
	{
		this.location = createVector(pointX, pointY);
		this.moveSpeed = options.moveSpeed;
		this.points = [];
		this.agentAlive = true;

		let points = createVector(
			this.location.x,
			this.location.y);

		this.points[0] = points;
	}

	drawLocation()
	{
		for (let i = 0; i < this.points.length; i++)
		{
			point(this.points[i].x, this.points[i].y);
		}
	}

	updateCycle()
	{
		if (false)
		{
			this.agentAlive = false;
		}
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