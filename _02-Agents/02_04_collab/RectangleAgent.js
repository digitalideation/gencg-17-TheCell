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
		//console.log(this.id+" :"+this.angle+"      VECTOR:"+this.vector);
		//this.length = moveSpeed*0.1;
		this.width = random(3,tileWidth/10);
		this.height = random(3,tileHeight/10);
		RectangleAgent.id++;
		this.id = RectangleAgent.id;
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
		stroke(options.agentColor,options.agentColor,options.agentColor);
		rect(this.positionX,this.positionY,this.width,this.height);
	}

	updateCycle()
	{
		if (!this.agentAlive)
		{
			return;
		}

		let newX;
		let newY;
		/*
		// only change blocked Agents angle if they are not send to neighbors
		// and should not bounce
		if (!options.sendToNeighbor && !options.bounceOffLocalBorder)
		{
			if (
				cos(this.angle) < 0.01
				&& cos(this.angle) > -0.01
				&& ((this.points[this.points.length - 1].y
					>= this.location.y + this.tileHeight / 2)
					|| (this.points[this.points.length - 1].y
					<= this.location.y - this.tileHeight / 2)))
			{
				// check if it is at the top or bottom middle and speed it up a bit
				this.incrementAngle();
			}
			else if (
				sin(this.angle) < 0.01
				&& sin(this.angle) > -0.01
				&& ((this.points[this.points.length - 1].x
					>= this.location.x + this.tileWidth / 2)
					|| (this.points[this.points.length - 1].x
					<= this.location.x - this.tileWidth / 2)))
			{
				// check if it is at the left or right middle and speed it up a bit
				this.incrementAngle();
			}
		}*/
	/*	this.positionX += this.vector.x*this.length;
		this.positionY += this.vector.y*this.length;
		RectangleAgent.collisionPointsArray.push({id:this.id,x:this.positionX,y:this.positionY,width:this.width,height:this.height,vector:this.vector.copy()});
	*/
		newX = this.positionX+this.vector.x*options.moveSpeed*0.5;
		newY = this.positionY+this.vector.y*options.moveSpeed*0.5;
		RectangleAgent.collisionPointsArray.push({id:this.id,x:this.positionX,y:this.positionY,width:this.width,height:this.height,vector:this.vector.copy()});

	/* 	newX = this.points[this.points.length - 1].x
			+ (cos(this.angle) * this.moveSpeed);
		newY = this.points[this.points.length - 1].y
			+ (sin(this.angle) * this.moveSpeed);
	*/
		// this must be after new positions checked
		// otherwise agents spawned in new tiles
		// will always hit borders at the start
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
		this.positionX = newX;
		this.positionY = newY;
		this.customBehaviour();
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
			this.hitRight = true;
		}

		// top local Border
		if (yCoord < (this.location.y - this.tileHeight / 2))
		{
			this.hitTop = true;
		}
		else if (yCoord+this.height > (this.location.y + this.tileHeight / 2))
		{
			this.hitBottom = true;
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
RectangleAgent.collisionPointsArray = [];