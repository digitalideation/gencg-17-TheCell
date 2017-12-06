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
			let agent;
			let startX;
			let startY;

			startX = x * options.tileSize + options.tileSize / 2;
			startY = y * options.tileSize + options.tileSize / 2;
			for (let i = 0; i < options.numberOfAgents; i++)
			{
				agent = new Agent(startX, startY);
				agents.push(agent);
			}
		}
	}

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

		// clean and restart dead Agents
		let amountKilled = cleanDeadAgents(agents, true);
		amountKilled.forEach( function (element, index, arr)
		{
			let agent;
			let startX;
			let startY;

			startX = element.location.x;
			startY = element.location.y;
			agent = new Agent(startX, startY);
			agents.push(agent);
		});

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

/**
 * removes dead agents from agents array and returns the count or the agents
 * that were removed
 * @param  {Array}  arrayWithAgents array with active and dead agents
 * @param  {Boolean} returnObjects    true if removed agents needed
 * @return {Integer or Array}       returns Integer amount killed or Array
 * with dead agents
 */
function cleanDeadAgents(arrayWithAgents, returnObjects = false)
{
	let killCount = 0;
	let killedObjects = [];

	arrayWithAgents.forEach( function(element, index, arr)
	{
		if (!element.agentAlive)
		{
			killedObjects.push(element);
			killCount ++;
			arr.splice(index, 1);
		}
	});

	if (returnObjects)
	{
		return killedObjects;
	}
	else
	{
		return killCount;
	}
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
		this.radius = options.tileSize / 2;
		this.pointRandom = false;
		this.drawAllPoints = false;
		this.useRadius = false;
		this.angle = random(0, Math.PI * 2);
		this.angleStep = Math.PI / 64;
		this.location = createVector(
			middlePointX,
			middlePointY);

		let points;
		if (this.pointRandom)
		{
			let xPos = random(
				this.location.x - this.tileWidth / 2,
				this.location.x + this.tileWidth / 2);
			let yPos = random(
				this.location.y - this.tileHeight / 2,
				this.location.y + this.tileHeight / 2);
			points = createVector(xPos, yPos);
		}
		else
		{
			points = createVector(
				this.location.x,
				this.location.y);
		}

		this.points[0] = points;
	}

	drawLocation(drawAllPointsAnyway = false)
	{
		if (drawAllPointsAnyway)
		{
			for (let i = 0; i < this.points.length; i++)
			{
				point(this.points[i].x, this.points[i].y);
			}
		}
		else
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
					this.points[this.points.length - 1].x,
					this.points[this.points.length - 1].y);
			}
		}
	}

	incrementAngle()
	{
		this.angle += this.angleStep;
	}

	decrementAngle()
	{
		this.angle -= this.angleStep;
	}

	updateCycle()
	{
		let newX;
		let newY;

		if (
			cos(this.angle) < 0.01
			&& cos(this.angle) > -0.01
			&& ((this.points[this.points.length - 1].y
				>= this.location.y + this.tileHeight / 2)
				|| (this.points[this.points.length - 1].y
				<= this.location.y - this.tileHeight / 2)))
		{
			// check if it is at the top or bottom middle and speed it up a bit
			this.angle = this.angle + this.angleStep;
		}
		else if (
			sin(this.angle) < 0.1
			&& sin(this.angle) > -0.1
			&& ((this.points[this.points.length - 1].x
				>= this.location.x + this.tileWidth / 2)
				|| (this.points[this.points.length - 1].x
				<= this.location.x - this.tileWidth / 2)))
		{
			// check if it is at the left or right middle and speed it up a bit
			this.angle = this.angle + this.angleStep;
		}

		newX = this.points[this.points.length - 1].x + cos(this.angle) * this.moveSpeed;
		newY = this.points[this.points.length - 1].y + sin(this.angle) * this.moveSpeed;

		if (this.useRadius)
		{
			if (
				Math.pow(Math.abs(newX - this.location.x), 2)
				+ Math.pow(Math.abs(newY - this.location.y), 2)
				< Math.pow(this.radius, 2))
			{
				// all normal
			}
			else
			{
				newX = this.points[this.points.length - 1].x;
				newY = this.points[this.points.length - 1].y;

				if (
					this.angle > Math.PI / 2
					&& this.angle < Math.PI * 3/2)
				{
					this.incrementAngle();
				}
				else if ((this.angle < Math.PI / 2)
					|| this.angle > Math.PI * 3/2)
				{
					this.decrementAngle();
				}

				/*
				if (this.angle > 0
					&& (this.angle < Math.PI
						|| this.angle > Math.PI * 3/2))
				{
					this.decrementAngle();
				}
				else
					*/

				// if (this.angle >= 0
				// 	&& this.angle < (Math.PI / 2))
				// {
				// 	// bottom right direction
				// 	// this.angle += angleStep;
				// 	this.incrementAngle();
				// }
				// else if (this.angle >= (Math.PI / 2)
				// 	&& this.angle < Math.PI)
				// {
				// 	// bottom left direction
				// 	// this.angle += angleStep;
				// 	this.incrementAngle();
				// }
				// else if (this.angle >= Math.PI
				// 	&& this.angle < (2 * Math.PI * 2 / 3))
				// {
				// 	// top left direction
				// 	// this.angle -= angleStep;
				// 	this.incrementAngle();
				// }
				// else if (this.angle >= (2 * Math.PI * 2 / 3)
				// 	&& this.angle < Math.PI * 2)
				// {
				// 	// top right direction
				// 	// this.angle += angleStep;
				// 	this.incrementAngle();
				// }
				// else
				// {
				// 	this.angle += angleStep;
				// }
			}
			// if (newX < (this.location.x - this.radius))
			// {
			// 	newX = this.location.x - this.radius;
			// }
			// else if (newX > (this.location.x + this.radius))
			// {
			// 	newX = this.location.x + this.radius;
			// }

			// if (newY < (this.location.y - this.radius))
			// {
			// 	newY = this.location.y - this.radius;
			// }
			// else if (newY > (this.location.y + this.radius))
			// {
			// 	newY = this.location.y + this.radius;
			// }
			if (this.angle > Math.PI * 2 || this.angle < 0)
			{
				this.agentAlive = false;
			}
		}
		else
		{
			// if (this.angle >= 0 && this.angle < Math.PI / 2)
			// {
			// 	// bottom right direction
			// }
			// else if (this.angle >= Math.PI / 2 && this.angle < Math.PI)
			// {
			// 	// bottom left direction
			// }
			// else if (this.angle >= Math.PI && this.angle < 2 * Math.PI / 3)
			// {
			// 	// top left direction
			// }
			// else
			// {
			// 	// top right direction
			// }

			// left local border
			if (newX < (this.location.x - this.tileWidth / 2))
			{
				newX = this.location.x - this.tileWidth / 2;
			}
			else if (newX > (this.location.x + this.tileWidth / 2))
			{
				newX = this.location.x + this.tileWidth / 2;
			}

			if (newY < (this.location.y - this.tileHeight / 2))
			{
				newY = this.location.y - this.tileHeight / 2;
			}
			else if (newY > (this.location.y + this.tileHeight / 2))
			{
				newY = this.location.y + this.tileHeight / 2;
			}

			let inTopLeftCorner = (newX <= this.location.x - this.tileWidth / 2
				&& newY <= this.location.y - this.tileHeight / 2);
			let inBottomRightCorner = (newX >= this.location.x + this.tileWidth / 2
				&& newY >= this.location.y + this.tileHeight / 2);
			let inTopRightCorner = (newX >= this.location.x + this.tileWidth / 2
				&& newY <= this.location.y - this.tileHeight / 2);
			let inBottomLeftCorner = (newX <= this.location.x - this.tileWidth / 2
				&& newY >= this.location.y + this.tileHeight / 2);

			if (inTopLeftCorner
				|| inBottomRightCorner
				|| inTopRightCorner
				|| inBottomLeftCorner)
			{
				this.agentAlive = false;
			}
		}

		let newP = createVector(newX, newY);
		this.points.push(newP);
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