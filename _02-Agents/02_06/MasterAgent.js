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

/**
 * Class for Tileinformation.
 *
 * @class      Tileinformation (name)
 * Structure to hold information about a Tile
 */
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

/**
 * Class for master agent.
 * This is a pseudointerface and has to be extended.
 * Update the drawLocation and customize the updateCycle
 *
 * @class      MasterAgent (name)
 */
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

	/**
	 * Gets called to draw the Agent.
	 */
	drawLocation()
	{
		if (!this.agentAlive)
		{
			return;
		}
	}

	/**
	 * The behaviour for each cycle is calculated and saved in here
	 */
	updateCycle()
	{
		if (!this.agentAlive)
		{
			return;
		}
	}

	/**
	 * Resets and checks local and window borders.
	 * Needs to be called for setNeighbor and to have updated variables
	 * in updateCycle
	 *
	 * @param      {Integer}  xCoord  The x coordinate for checking
	 * @param      {Integer}  yCoord  The y coordinate for checking
	 */
	checkBorders(xCoord, yCoord)
	{
		this.hitTop = false;
		this.hitRight = false;
		this.hitBottom = false;
		this.hitLeft = false;
		this.hitTopWindowBorder = false;
		this.hitRightWindowBorder = false;
		this.hitBottomWindowBorder = false;
		this.hitLeftWindowBorder = false;

		// check if hit a window border
		if (xCoord > windowWidth)
		{
			this.hitRightWindowBorder = true;
		}
		else if (xCoord < 0)
		{
			this.hitLeftWindowBorder = true;
		}

		if (yCoord > windowHeight)
		{
			this.hitBottomWindowBorder = true;
		}
		else if (yCoord < 0)
		{
			this.hitTopWindowBorder = true;
		}

		if (this.useRadius)
		{
			// TODO
		}
		else
		{
			// left local border
			if (xCoord < (this.location.x - this.tileWidth / 2))
			{
				this.hitLeft = true;
			}
			else if (xCoord > (this.location.x + this.tileWidth / 2))
			{
				this.hitRight = true;
			}

			// top local Border
			if (yCoord < (this.location.y - this.tileHeight / 2))
			{
				this.hitTop = true;
			}
			else if (yCoord > (this.location.y + this.tileHeight / 2))
			{
				this.hitBottom = true;
			}
		}
	}

	/**
	 * Sets a Neighborcell
	 *
	 * @param      {Enumeration}  neighborNumber   The neighbor number
	 * @param      {Tileinformation Class}  tileinformation  The tileinformation
	 */
	setNeighbor(neighborNumber, tileinformation)
	{
		this.neighborCells[neighborNumber] = tileinformation;
	}

	/**
	 * chooses which cell it should send the agent information to based on
	 * checkBorders, creates the Agent based on the spawnLogic,
	 * updates the new Agents surroundingCells and kills itself
	 *
	 * @param      {Integer}  startX  The start x of the new agent
	 * @param      {Integer}  startY  The start y of the new agent
	 */
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
					agent = new RectangleAgent(
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