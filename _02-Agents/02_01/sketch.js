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

	background(options.backgroundColor);
}

function draw()
{
	if (window.somethingChanged)
	{
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

	agents.forEach( function ( element, index, arr)
	{
		element.walkCycle();
	});

	window.somethingChanged = true;
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
	constructor(pointX, pointY, lineLength)
	{
		this.location = createVector(pointX, pointY);
		this.startAngle = random(0, TWO_PI);
		this.lineLength = lineLength;
		this.points = [];

		for (let i = 0; i < this.lineLength; i++)
		{
			let points = createVector(
							this.location.x + cos(this.startAngle),
							this.location.y + sin(this.startAngle)
						);

			this.points[i] = points;
		}
	}

	drawLocation()
	{
		//console.log(this.points.length);

		for (let i = 0; i < this.points.length; i++)
		{
			point(this.points[i].x, this.points[i].y);
		}
	}

	walkCycle()
	{
		if (this.location.x > 0)
		{
			if (this.location.x < windowWidth)
			{
			}
			else
			{
				// going out on the right
				// pi random to the left
				this.startAngle = random(PI/2, 3*PI/2);
			}
		}
		else
		{
			// going out on the left
			// pi random to the right
			this.startAngle = (-PI/2) + random(0, PI);
		}

		if (this.location.y > 0)
		{
			if (this.location.y < windowHeight)
			{
			}
			else
			{
				// going out on the bottom
				this.startAngle = random(PI, TWO_PI);
			}
		}
		else
		{
			// going out on the top
			this.startAngle = random(0, PI);
		}

		this.points.shift();
		this.location.x = this.location.x + cos(this.startAngle);
		this.location.y = this.location.y + sin(this.startAngle);
		let differentLoc = Object.assign({}, this.location);
		this.points[this.points.length] = differentLoc;
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