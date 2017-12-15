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
	document.getElementById("defaultCanvas0")
		.addEventListener("click", spawnAgentClickEvent);

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
			// let agent;

			// agent = new Agent(
			// 	element.location.x,
			// 	element.location.y,
			// 	element.location.x,
			// 	element.location.y,
			// 	random(0, Math.PI * 2),
			// 	2,
			// 	options.tileWidth,
			// 	options.tileHeight);
			// agent.neighborCells = element.neighborCells;
			// agents.push(agent);
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
	for (let i = 0; i < options.numberOfAgents; i++)
	{
		let startX = random(0, windowWidth);
		let startY = random(0, windowHeight);
		let agent;

		switch(Math.floor(random(0,4)))
		{
			case 0:
				agent = new RectangleAgent(
					windowWidth / 2,
					windowHeight / 2,
					startX,
					startY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
			case 1:
				agent = new ThreadAgent(
					windowWidth / 2,
					windowHeight / 2,
					startX,
					startY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
			case 2:
				agent = new PulseAgent(
					windowWidth / 2,
					windowHeight / 2,
					startX,
					startY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
			case 3:
				agent = new WormAgent(
					windowWidth / 2,
					windowHeight / 2,
					startX,
					startY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
		}

		agents.push(agent);
	}
}

function spawnAgentClickEvent()
{
	//center of current tile
	let currentTileCenterX =
		options.tileWidth *
		Math.floor(mouseX/options.tileWidth)
		+ options.tileWidth/2;
	let currentTileCenterY =
		options.tileHeight *
		Math.floor(mouseY/options.tileHeight)
		+ options.tileHeight/2;

	let cellinformation = new Tileinformation(
				currentTileCenterX,
				currentTileCenterY,
				options.tileWidth,
				options.tileHeight,
				1);

	if (cellinformation.centerX
		&& cellinformation.centerY
		&& cellinformation.tileWidth
		&& cellinformation.tileHeight
		&& cellinformation.radius)
	{
		let tileNrX = Math.floor(cellinformation.centerX
			/ options.tileWidth);
		let tileNrY = Math.floor(cellinformation.centerY
			/ options.tileHeight);

		let agent;

		switch(Math.floor(random(0,4)))
		{
			case 0:
				agent = new RectangleAgent(
					windowWidth / 2,
					windowHeight / 2,
					mouseX,
					mouseY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
			case 1:
				agent = new ThreadAgent(
					windowWidth / 2,
					windowHeight / 2,
					mouseX,
					mouseY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
			case 2:
				agent = new PulseAgent(
					windowWidth / 2,
					windowHeight / 2,
					mouseX,
					mouseY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
			case 3:
				agent = new WormAgent(
					windowWidth / 2,
					windowHeight / 2,
					mouseX,
					mouseY,
					random(0, Math.PI * 2),
					options.moveSpeed,
					windowWidth,
					windowHeight);
				break;
		}

		// check for borders and update all neighborcells
		// top border
		agent.neighborCells[Agent.surroundingCellEnum.TOP] =
			new Tileinformation(
				agent.location.x,
				agent.location.y - agent.tileHeight,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		// set right border
		agent.neighborCells[Agent.surroundingCellEnum.RIGHT] =
			new Tileinformation(
				agent.location.x + agent.tileWidth,
				agent.location.y,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		// set Bottom border
		agent.neighborCells[Agent.surroundingCellEnum.BOTTOM] =
			new Tileinformation(
				agent.location.x,
				agent.location.y + agent.tileHeight,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		// left border
		agent.neighborCells[Agent.surroundingCellEnum.LEFT] =
			new Tileinformation(
				agent.location.x - agent.tileWidth,
				agent.location.y,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		// edge Cases
		// top right Border
		agent.neighborCells[Agent.surroundingCellEnum.TOPRIGHTCORNER] =
			new Tileinformation(
				agent.location.x + agent.tileWidth,
				agent.location.y - agent.tileHeight,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		// bottom right
		agent.neighborCells[Agent.surroundingCellEnum.BOTTOMRIGHTCORNER] =
			new Tileinformation(
				agent.location.x + agent.tileWidth,
				agent.location.y + agent.tileHeight,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		// bottom left
		agent.neighborCells[Agent.surroundingCellEnum.BOTTOMLEFTCORNER] =
			new Tileinformation(
				agent.location.x - agent.tileWidth,
				agent.location.y + agent.tileHeight,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		// top left
		agent.neighborCells[Agent.surroundingCellEnum.TOPLEFTCORNER] =
			new Tileinformation(
				agent.location.x - agent.tileWidth,
				agent.location.y - agent.tileHeight,
				agent.tileWidth,
				agent.tileHeight,
				agent.radius);

		agents.push(agent);
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