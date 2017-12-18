"use strict";

// Global var
let mouseInputMode = 0;
//let cycleInterval;
let agents = [];

function setup()
{
	// Canvas setup
	canvas = createCanvas(windowWidth, windowHeight - 45);
	canvas.parent("p5Container");
	// Detect screen density (retina)
	var density = displayDensity();
	pixelDensity(density);

	randomSeed(options.randomSeed);

	//spawnAgents();
	document.getElementById("defaultCanvas0").addEventListener("click", spawnAgentClickEvent);
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

		if (tileNrY % 2 == 0)
		{
			if (tileNrX % 2 == 0)
			{
				// first agent
				agent = new ThreadAgent(
					cellinformation.centerX,
					cellinformation.centerY,
					mouseX,
					mouseY,
					this.angle,
					options.moveSpeed,
					cellinformation.tileWidth,
					cellinformation.tileHeight,
					cellinformation.radius);
			}
			else
			{
				// alt
				agent = new PulseAgent(
					cellinformation.centerX,
					cellinformation.centerY,
					mouseX,
					mouseY,
					this.angle,
					options.moveSpeed,
					cellinformation.tileWidth,
					cellinformation.tileHeight,
					cellinformation.radius);
			}
		}
		else
		{
			if (tileNrX % 2 != 0)
			{
				// first agent
				agent = new RectangleAgent(
					cellinformation.centerX,
					cellinformation.centerY,
					mouseX,
					mouseY,
					this.angle,
					options.moveSpeed,
					cellinformation.tileWidth,
					cellinformation.tileHeight,
					cellinformation.radius);
			}
			else
			{
				// alt
				agent = new WormAgent(
					cellinformation.centerX,
					cellinformation.centerY,
					mouseX,
					mouseY,
					this.angle,
					options.moveSpeed,
					cellinformation.tileWidth,
					cellinformation.tileHeight,
					cellinformation.radius);
			}
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

function spawnAgents()
{
	for (let y = 0; y * options.tileHeight < windowHeight; y++)
	{
		for(let x = 0; x * options.tileWidth < windowWidth; x++)
		{
			let agent;
			let startX;
			let startY;

			startX = x * options.tileWidth + options.tileWidth / 2;
			startY = y * options.tileHeight + options.tileHeight / 2;
			for (let i = 0; i < options.numberOfAgents; i++)
			{
				let tileNrX = Math.floor(startX
				/ options.tileWidth);
				let tileNrY = Math.floor(startY
					/ options.tileHeight);

				let agent;

				if (tileNrY % 2 == 0)
				{
					if (tileNrX % 2 == 0)
					{
						// first agent
						agent = new ThreadAgent(
							startX,
							startY,
							startX,
							startY,
							random(0, Math.PI * 2),
							options.moveSpeed,
							options.tileWidth,
							options.tileHeight);
					}
					else
					{
						// alt
						agent = new PulseAgent(
							startX,
							startY,
							startX,
							startY,
							random(0, Math.PI * 2),
							options.moveSpeed,
							options.tileWidth,
							options.tileHeight);
					}
				}
				else
				{
					if (tileNrX % 2 != 0)
					{
						// first agent
						agent = new RectangleAgent(
							startX,
							startY,
							startX,
							startY,
							random(0, Math.PI * 2),
							options.moveSpeed,
							options.tileWidth,
							options.tileHeight);
					}
					else
					{
						// alt
						agent = new WormAgent(
							startX,
							startY,
							startX,
							startY,
							random(0, Math.PI * 2),
							options.moveSpeed,
							options.tileWidth,
							options.tileHeight);
					}
				}

				// set tile infos
				// set tile on the left
				if (x > 0)
				{
					let tileInfo = new Tileinformation(
						(x - 1) * options.tileWidth + options.tileWidth / 2,
						startY);
					agent.setNeighbor(
						Agent.surroundingCellEnum.LEFT,
						tileInfo);
				}

				// set tile on top
				if (y > 0)
				{
					let tileInfo = new Tileinformation(
						startX,
						(y - 1) * options.tileHeight + options.tileHeight / 2);
					agent.setNeighbor(
						Agent.surroundingCellEnum.TOP,
						tileInfo);
				}

				// set right neighbor
				if ((x + 1) * options.tileWidth < windowWidth)
				{
					let tileInfo = new Tileinformation(
						(x + 1) * options.tileWidth + options.tileWidth / 2,
						startY);
					agent.setNeighbor(
						Agent.surroundingCellEnum.RIGHT,
						tileInfo);
				}

				// set bottom neighbor
				if ((y + 1) * options.tileHeight < windowHeight)
				{
					let tileInfo = new Tileinformation(
						startX,
						(y + 1) * options.tileHeight + options.tileHeight / 2);
					agent.setNeighbor(
						Agent.surroundingCellEnum.BOTTOM,
						tileInfo);
				}

				// set tile on the top left corner
				if (x > 0 && y > 0)
				{
					let tileInfo = new Tileinformation(
						(x - 1) * options.tileWidth + options.tileWidth / 2,
						(y - 1) * options.tileHeight + options.tileHeight / 2);
					agent.setNeighbor(
						Agent.surroundingCellEnum.TOPLEFTCORNER,
						tileInfo);
				}

				// set tile on the top right corner
				if (((x + 1) * options.tileWidth < windowWidth)
					&& ((y - 1) * options.tileHeight < windowHeight))
				{
					let tileInfo = new Tileinformation(
						(x + 1) * options.tileWidth + options.tileWidth / 2,
						(y - 1) * options.tileHeight + options.tileHeight / 2);
					agent.setNeighbor(
						Agent.surroundingCellEnum.TOPRIGHTCORNER,
						tileInfo);
				}

				// set tile on the bottom right corner
				if (((x + 1) * options.tileWidth < windowWidth)
					&& ((y + 1) * options.tileHeight < windowHeight))
				{
					let tileInfo = new Tileinformation(
						(x + 1) * options.tileWidth + options.tileWidth / 2,
						(y + 1) * options.tileHeight + options.tileHeight / 2);
					agent.setNeighbor(
						Agent.surroundingCellEnum.BOTTOMRIGHTCORNER,
						tileInfo);
				}

				// set tile on the bottom left corner
				if (((x - 1) * options.tileWidth < windowWidth)
					&& ((y + 1) * options.tileHeight < windowHeight))
				{
					let tileInfo = new Tileinformation(
						(x - 1) * options.tileWidth + options.tileWidth / 2,
						(y + 1) * options.tileHeight + options.tileHeight / 2);
					agent.setNeighbor(
						Agent.surroundingCellEnum.BOTTOMLEFTCORNER,
						tileInfo);
				}

				// push agent to array
				agents.push(agent);
			}
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