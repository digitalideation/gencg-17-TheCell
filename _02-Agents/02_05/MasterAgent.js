class Agent {}

/**
 * NeighborCells Names
 * @type {Integer}
 */
Agent.surroundingCellEnum = {
	TOPLEFTCORNER: 0,
	TOP: 1,
	TOPRIGHTCORNER: 2,
	LEFT: 3,
	RIGHT: 4,
	BOTTOMLEFTCORNER: 5,
	BOTTOM: 6,
	BOTTOMRIGHTCORNER: 7
}

class Tileinformation
{
	constructor(
		centerX,
		centerY,
		tileWidth = options.tileWidth,
		tileHeight = options.tileHeight,
		radius = options.tileWidth / 2)
	{
		this.centerX = centerX,
		this.centerY = centerY,
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.radius = radius;
	}
}

class MasterAgent
{
	constructor(
		middlePointX,
		middlePointY,
		spawnX = middlePointX,
		spawnY = middlePointY,
		angle = random(0, Math.PI * 2),
		moveSpeed = options.moveSpeed,
		tileWidth = options.tileWidth,
		tileHeight = options.tileHeight)
	{
		// set properties
		this.moveSpeed = moveSpeed;
		this.agentAlive = true;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.angle = angle;

		// set sendToNeighbor properties
		this.neighborCells = [];
		this.neighborCells[Agent.surroundingCellEnum.TOPLEFTCORNER] = {};
		this.neighborCells[Agent.surroundingCellEnum.TOP] = {};
		this.neighborCells[Agent.surroundingCellEnum.TOPRIGHTCORNER] = {};
		this.neighborCells[Agent.surroundingCellEnum.LEFT] = {};
		this.neighborCells[Agent.surroundingCellEnum.RIGHT] = {};
		this.neighborCells[Agent.surroundingCellEnum.BOTTOMLEFTCORNER] = {};
		this.neighborCells[Agent.surroundingCellEnum.BOTTOM] = {};
		this.neighborCells[Agent.surroundingCellEnum.BOTTOMRIGHTCORNER] = {};

		// set border properties
		this.hitTop = false;
		this.hitRight = false;
		this.hitBottom = false;
		this.hitLeft = false;
		this.hitTopWindowBorder = false;
		this.hitRightWindowBorder = false;
		this.hitBottomWindowBorder = false;
		this.hitLeftWindowBorder = false;

		// set middle point
		this.location = createVector(
			middlePointX,
			middlePointY);
	}

	drawLocation()
	{
		if (!this.agentAlive)
		{
			return;
		}
	}

	updateCycle()
	{
		if (!this.agentAlive)
		{
			return;
		}
	}

	checkBorders(xCoord, yCoord)
	{
	}

	setNeighbor(neighborNumber, tileinformation)
	{
		this.neighborCells[neighborNumber] = tileinformation;
	}

	sendToNeighborCell(startX, startY)
	{
		let cellinformation;

		// TODO later: break this apart for exchangable neighbors
		if (this.hitTop && this.hitRight)
		{
			// top right corner
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.TOPRIGHTCORNER];
		}
		else if (this.hitBottom && this.hitRight)
		{
			// bottom right corner
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.BOTTOMRIGHTCORNER];
		}
		else if (this.hitBottom && this.hitLeft)
		{
			// bottom left corner
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.BOTTOMLEFTCORNER];
		}
		else if (this.hitTop && this.hitLeft)
		{
			// top left corner
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.TOPLEFTCORNER];
		}
		else if (this.hitTop)
		{
			// Top
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.TOP];
		}
		else if (this.hitRight)
		{
			// Right
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.RIGHT];
		}
		else if (this.hitBottom)
		{
			// Bottom
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.BOTTOM];
			// console.log("hitBottom", this.location, cellinformation);
		}
		else if (this.hitLeft)
		{
			// Left
			cellinformation = this
				.neighborCells[Agent.surroundingCellEnum.LEFT];
		}

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
						startX,
						startY,
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
						startX,
						startY,
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
					agent = new ThreadAgent(
						cellinformation.centerX,
						cellinformation.centerY,
						startX,
						startY,
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
						startX,
						startY,
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

		this.agentAlive = false;
	}
}