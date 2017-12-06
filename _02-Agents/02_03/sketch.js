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

	for (let y = 0; y * options.tileSize < windowHeight; y++)
	{
		for(let x = 0; x * options.tileSize < windowWidth; x++)
		{
			let agent = new Agent(
					random(
						x * options.tileSize,
						x * options.tileSize + options.tileSize),
					random(
						y * options.tileSize,
						y * options.tileSize + options.tileSize));

			agents.push(agent);
		}
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
	constructor(middlePointX, middlePointY)
	{
		this.moveSpeed = options.moveSpeed;
		this.points = [];
		this.agentAlive = true;
		this.tileWidth = options.tileSize;
		this.tileHeight = options.tileSize;
		this.radius = options.tileSize;
		this.pointRandom = false;
		this.drawAllPoints = false;
		this.useRadius = true;
		this.angle = random(0, TWO_PI);
		this.location = createVector(
			middlePointX,
			middlePointY);

		let points = createVector(
			this.location.x,
			this.location.y);

		this.points[0] = points;
	}

	drawLocation()
	{
		if (this.drawAllPoints)
		{
			for (let i = 0; i < this.points.length; i++)
			{
				point(this.points[i].x, this.points[i].y);
			}
		}
		else
		{
			point(
				this.points[this.points.length -1].x,
				this.points[this.points.length -1].y);
		}
	}

	updateCycle()
	{
		if (this.useRadius)
		{
			let newX = this.points[this.points.length -1].x + cos(this.angle);
			let newY = this.points[this.points.length -1].y + sin(this.angle);

			if (newX - (this.location.x - this.radius/2) < 0)
			{
				newX = this.location.x - this.radius/2;
			}
			else if (newX - this.location.x > this.location.x + this.radius/2)
			{
				newX = this.location.x + this.radius/2;
			}

			if (newY - (this.location.y - this.radius/2) < 0)
			{
				newY = this.location.y - this.radius/2;
			}
			else if (newY - this.location.y > this.location.y + this.radius/2)
			{
				newY = this.location.y + this.radius/2;
			}

			let newP = createVector(newX, newY);
			this.points.push(newP);
		}

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