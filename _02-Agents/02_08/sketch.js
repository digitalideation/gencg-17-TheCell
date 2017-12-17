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

	spawnAgents();

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

			agent = new NoiseAgent(
				element.location.x,
				element.location.y,
				element.points[0].x,
				element.points[0].y,
				map(
					noise(
						element.location.x,
						element.location.y),
					0,
					1,
					0,
					Math.PI * 2),
				2,
				options.tileWidth,
				options.tileHeight);

			agent.neighborCells = element.neighborCells;
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

function spawnAgents()
{
	for (let y = 0; y < options.numberOfAgents; y++)
	{
		for (let x = 0; x < options.numberOfAgents; x++)
		{

			let startX;
			let startY;
			let startPosX;
			let startPosY;

			startX = options.tileWidth / 2;
			startY = options.tileHeight / 2;
			startPosX = x * options.tileWidth / options.numberOfAgents;
			startPosY = y * options.tileHeight / options.numberOfAgents;

			let agent;
			let tileNrX = Math.floor(startX
				/ options.tileWidth);
			let tileNrY = Math.floor(startY
				/ options.tileHeight);
			let spreading = map(
				sin(options.randomSeed + tileNrX * tileNrY),
				-1,
				1,
				0,
				4);

			agent = new NoiseAgent(
				startX,
				startY,
				startPosX,
				startPosY,
				map(
					noise(
						(startX + options.randomSeed)
							/ options.mapReduction,
						(startY + options.randomSeed)
							/ options.mapReduction),
					0,
					1,
					0,
					Math.PI * 2),
				options.moveSpeed,
				options.tileWidth,
				options.tileHeight);
			agents.push(agent);
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