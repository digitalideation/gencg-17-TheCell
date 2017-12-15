class RectangleAgent extends MasterAgent
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
		super(
			middlePointX,
			middlePointY,
			spawnX,
			spawnY,
			angle,
			moveSpeed,
			tileWidth,
			tileHeight);
		this.positionX = spawnX;
		this.positionY = spawnY;
		this.vector = this.vectorFromAngle(angle);
		this.width = random(options.agentFatness,options.agentFatness*3);
		this.height = random(options.agentFatness,options.agentFatness*3);
		RectangleAgent.id++;
		this.id = RectangleAgent.id;
		this.SpawnBottom = true;
		this.SpawnRight = true;
		//detect if a collision happened
		this.collisionHappened = false;
		this.fatness = options.agentFatness;
	}

	vectorFromAngle(angle){
		return createVector(cos(angle),sin(angle));
	}

	drawLocation(drawAllPointsAnyway = false)
	{
		if (!this.agentAlive)
		{
			return;
		}
		if(this.fatness != options.agentFatness){
			this.fatness = options.agentFatness;
			this.width = random(options.agentFatness*1.2,options.agentFatness*3.5);
			this.height = random(options.agentFatness*1.2,options.agentFatness*3.5);
		}
		stroke(options.agentColor,options.agentColor,options.agentColor);
		rect(this.positionX,this.positionY,this.width,this.height);
	}

	updateCycle()
	{
		if (!this.agentAlive)
		{
			return;
		}
		//this which can be used inside the foreach
		let currentRectangle = this;
		//checks for collisions and changes movement direction
		agents.forEach(function (ele, index, arr)
		{
			if (ele instanceof RectangleAgent)
			{
				if (ele.id != currentRectangle.id)
				{
					if(ele.id != currentRectangle.id &&
						(currentRectangle.positionX <= ele.positionX+ele.width &&
					 currentRectangle.positionX+currentRectangle.width >= ele.positionX &&
					  currentRectangle.positionY <= ele.positionY + ele.height &&
					   currentRectangle.positionY+currentRectangle.height >= ele.positionY))
					{
						currentRectangle.vector.x *= -1;
						currentRectangle.vector.y *= -1;
						currentRectangle.collisionHappened = true;
					}
				}
			}
		});
		let newX;
		let newY;

		newX = this.positionX+this.vector.x*options.moveSpeed*0.5;
		newY = this.positionY+this.vector.y*options.moveSpeed*0.5;
		if(this.collisionHappened){
			newX += this.vector.x*options.moveSpeed*0.5+random(0,2)-1;
			newY += this.vector.y*options.moveSpeed*0.5+random(0,2)-1;
			this.collisionHappened = false;
		}
		this.checkBorders(newX, newY);
		this.changeAngleBasedOnBorders();

		if (!options.sendToNeighbor && !options.bounceOffLocalBorder)
		{
			// reset Position if local Border is met
			if (this.hitLeft)
			{
				newX = this.location.x - this.tileWidth / 2;
			}
			else if (this.hitRight)
			{
				newX = this.location.x - this.width + this.tileWidth / 2;
			}

			// top local Border
			if (this.hitTop)
			{
				newY = this.location.y - this.tileHeight / 2;
			}
			else if (this.hitBottom)
			{
				newY = this.location.y - this.height + this.tileHeight / 2;
			}
		}
		else if (!options.sendToNeighbor && options.bounceOffLocalBorder)
		{
			// reset Position if local Border is met
			if (this.hitLeft)
			{
				newX = this.location.x - this.tileWidth / 2;
			}
			else if (this.hitRight)
			{
				newX = this.location.x - this.width + this.tileWidth / 2;
			}

			// top local Border
			if (this.hitTop)
			{
				newY = this.location.y - this.tileHeight / 2;
			}
			else if (this.hitBottom)
			{
				newY = this.location.y - this.height + this.tileHeight / 2;
			}
		}
		else if (options.sendToNeighbor)
		{
			if ((this.hitTop)
				&& !this.hitTopWindowBorder)
			{
				this.angle = this.vector.heading();
				this.sendToNeighborCell(newX, newY);
			}
			else if ((this.hitLeft)
				&& !(this.hitLeftWindowBorder))
			{
				this.angle = this.vector.heading();
				this.sendToNeighborCell(newX, newY);
			}
			else if ((this.hitBottom)
				&& !(this.hitBottomWindowBorder))
			{
				this.angle = this.vector.heading();
				this.sendToNeighborCell(newX, newY+this.height);
			}
			else if ((this.hitRight)
				&& !(this.hitRightWindowBorder))
			{
				this.angle = this.vector.heading();
				this.sendToNeighborCell(newX+this.width, newY);
			}
		}
		if(!this.SpawnRight){
			this.positionX = newX;
		}
		if(!this.SpawnBottom){
			this.positionY = newY;
		}
		this.customBehaviour();

		this.SpawnRight = false;
		this.SpawnBottom = false;
	}

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
		if (xCoord+this.width > windowWidth)
		{
			this.hitRightWindowBorder = true;
		}
		else if (xCoord < 0)
		{
			this.hitLeftWindowBorder = true;
		}

		if (yCoord+this.height > windowHeight)
		{
			this.hitBottomWindowBorder = true;
		}
		else if (yCoord < 0)
		{
			this.hitTopWindowBorder = true;
		}
		// left local border
		if (xCoord < (this.location.x - this.tileWidth / 2))
		{
			this.hitLeft = true;
		}
		else if (xCoord+this.width > (this.location.x + this.tileWidth / 2))
		{
			if(this.SpawnRight){
				this.positionX -= (this.width+5);
			}else{
				this.hitRight = true;
			}
		}

		// top local Border
		if (yCoord < (this.location.y - this.tileHeight / 2))
		{
			this.hitTop = true;
		}
		else if (yCoord+this.height > (this.location.y + this.tileHeight / 2))
		{
			if(this.SpawnBottom){
				this.positionY -= (this.height+5);
			}else{
				this.hitBottom = true;
			}
		}
	}

	changeAngleBasedOnBorders()
	{
		if (options.bounceOffWindowBorder)
		{
			if(this.hitTopWindowBorder)
			{
				this.vector.y *= -1;
			}
			if (this.hitRightWindowBorder)
			{
				this.vector.x *= -1;
			}
			if (this.hitBottomWindowBorder)
			{
				this.vector.y *= -1;
			}
			if (this.hitLeftWindowBorder)
			{
				this.vector.x *= -1;
			}

			// edge cases
			if (this.hitTopWindowBorder && this.hitRightWindowBorder)
			{
				this.vector.y *= -1;
				this.vector.x *= -1;
			}
			if (this.hitRightWindowBorder && this.hitBottomWindowBorder)
			{
				this.vector.y *= -1;
				this.vector.x *= -1;
			}
			if (this.hitBottomWindowBorder && this.hitLeftWindowBorder)
			{
				this.vector.y *= -1;
				this.vector.x *= -1;
			}
			if (this.hitLeftWindowBorder && this.hitTopWindowBorder)
			{
				this.vector.y *= -1;
				this.vector.x *= -1;
			}
		}

		if (options.sendToNeighbor)
		{
			return;
		}

		if (options.bounceOffLocalBorder
			&& this.useRadius
			&& (this.hitTop
			|| this.hitBottom
			|| this.hitLeft
			|| this.hitRight))
		{
			// TODO
			// using radius
		}
		else if (options.bounceOffLocalBorder
			&& (this.hitTop
			|| this.hitBottom
			|| this.hitLeft
			|| this.hitRight))
		{
			if(this.hitTop)
			{
				this.vector.y *= -1;
			}
			if (this.hitRight)
			{
				this.vector.x *= -1;
			}
			if (this.hitBottom)
			{
				this.vector.y *= -1;
			}
			if (this.hitLeft)
			{
				this.vector.x *= -1;
			}

			// edge cases
			if (this.hitTop && this.hitRight)
			{
				this.vector.y *= -1;
				this.vector.x *= -1;
			}
			if (this.hitLeft && this.hitTop)
			{
				this.vector.y *= -1;
				this.vector.x *= -1;
			}
		}
	}

	customBehaviour()
	{
		// Agent custom behaviour comes here
	}
}
RectangleAgent.id = 0;