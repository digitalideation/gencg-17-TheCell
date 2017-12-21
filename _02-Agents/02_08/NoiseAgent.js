class NoiseAgent extends MasterAgent
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
		this.points = [];
		this.angleStep = Math.PI / 64;
		this.timeToLive = random(50, options.timeToLive);

		// draw the startingpoint
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
				spawnX,
				spawnY);
		}

		this.points[0] = points;
	}

	drawLocation(drawAllPointsAnyway = false)
	{
		if (!this.agentAlive)
		{
			return;
		}

		// draw debug border
		if (window.debugMode)
		{
			stroke(color([150, 150, 150]));
			strokeWeight(1);
			// draw Right
			line(this.location.x + this.tileWidth / 2,
				this.location.y - this.tileHeight / 2,
				this.location.x + this.tileWidth / 2,
				this.location.y + this.tileHeight / 2);
			// draw Bottom
			line(this.location.x - this.tileWidth / 2,
				this.location.y + this.tileHeight / 2,
				this.location.x + this.tileWidth / 2,
				this.location.y + this.tileHeight / 2);
			stroke(color(options.agentColor));
			strokeWeight(options.agentFatness);
		}

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

	updateCycle()
	{
		if (!this.agentAlive)
		{
			return;
		}
		this.timeToLive--;

		let newX;
		let newY;

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
		}
		let startX = this.points[this.points.length - 1].x;
		let startY = this.points[this.points.length - 1].y;

		newX = startX
			+ (cos(
				map(
					noise(
						(startX + options.randomSeed) / options.mapReduction,
						(startY + options.randomSeed) / options.mapReduction),
					0,
					1,
					0,
					Math.PI * 2))
			* options.moveSpeed);
		newY = startY
			+ (sin(
				map(
					noise(
						(startX + options.randomSeed) / options.mapReduction,
						(startY + options.randomSeed) / options.mapReduction),
					0,
					1,
					0,
					Math.PI * 2))
			* options.moveSpeed);

		// this must be after new positions checked
		// otherwise agents spawned in new tiles
		// will always hit borders at the start
		this.checkBorders(newX, newY);
		this.changeAngleBasedOnBorders();

		if (!this.useRadius)
		{
			if (options.respawnOnWallHit && (this.hitTop
				|| this.hitRight
				|| this.hitBottom
				|| this.hitLeft)
				|| this.timeToLive <= 0)
			{
				this.agentAlive = false;
			}
			if (!options.sendToNeighbor && !options.bounceOffLocalBorder)
			{
				// reset Position if local Border is met
				if (this.hitLeft)
				{
					newX = this.location.x - this.tileWidth / 2;
				}
				else if (this.hitRight)
				{
					newX = this.location.x + this.tileWidth / 2;
				}

				// top local Border
				if (this.hitTop)
				{
					newY = this.location.y - this.tileHeight / 2;
				}
				else if (this.hitBottom)
				{
					newY = this.location.y + this.tileHeight / 2;
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
					newX = this.location.x + this.tileWidth / 2;
				}

				// top local Border
				if (this.hitTop)
				{
					newY = this.location.y - this.tileHeight / 2;
				}
				else if (this.hitBottom)
				{
					newY = this.location.y + this.tileHeight / 2;
				}
			}
			else if (options.sendToNeighbor)
			{
				// if wall is hit
				if ((this.hitTop
					|| this.hitBottom
					|| this.hitLeft
					|| this.hitRight)
					&& !(this.hitTopWindowBorder
						|| this.hitRightWindowBorder
						|| this.hitBottomWindowBorder
						|| this.hitLeftWindowBorder))
				{
					this.sendToNeighborCell(newX, newY);
				}
			}
		}

		let newP = createVector(newX, newY);
		this.points.push(newP);
	}

	incrementAngle()
	{
		this.angle += this.angleStep;
	}

	decrementAngle()
	{
		this.angle -= this.angleStep;
	}

	changeAngleBasedOnBorders()
	{
		if (options.bounceOffWindowBorder)
		{
			if(this.hitTopWindowBorder)
			{
				this.angle = random(0, Math.PI);
			}
			if (this.hitRightWindowBorder)
			{
				this.angle = random(Math.PI / 2, Math.PI * 3/2)
			}
			if (this.hitBottomWindowBorder)
			{
				this.angle = random(Math.PI, Math.PI * 2);
			}
			if (this.hitLeftWindowBorder)
			{
				this.angle = random(Math.PI / 2, Math.PI * 3/2)
					+ Math.PI;
			}

			// edge cases
			if (this.hitTopWindowBorder && this.hitRightWindowBorder)
			{
				this.angle = random(Math.PI / 2, Math.PI);
			}
			if (this.hitRightWindowBorder && this.hitBottomWindowBorder)
			{
				this.angle = random(Math.PI, Math.PI * 3/2);
			}
			if (this.hitBottomWindowBorder && this.hitLeftWindowBorder)
			{
				this.angle = random(Math.PI * 3/2, Math.PI * 2);
			}
			if (this.hitLeftWindowBorder && this.hitTopWindowBorder)
			{
				this.angle = random(0, Math.PI / 2);
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
			&& !this.useRadius
			&& (this.hitTop
			|| this.hitBottom
			|| this.hitLeft
			|| this.hitRight))
		{
			if(this.hitTop)
			{
				this.angle = random(0, Math.PI);
			}
			if (this.hitRight)
			{
				this.angle = random(Math.PI / 2, Math.PI * 3/2)
			}
			if (this.hitBottom)
			{
				this.angle = random(Math.PI, Math.PI * 2);
			}
			if (this.hitLeft)
			{
				this.angle = random(Math.PI / 2, Math.PI * 3/2)
					+ Math.PI;
			}

			// edge cases
			if (this.hitTop && this.hitRight)
			{
				this.angle = random(Math.PI / 2, Math.PI);
			}
			if (this.hitBottom)
			{
				this.angle = random(Math.PI, Math.PI * 3/2);
			}
			if (this.hitBottom)
			{
				this.angle = random(Math.PI * 3/2, Math.PI * 2);
			}
			if (this.hitLeft && this.hitTop)
			{
				this.angle = random(0, Math.PI / 2);
			}
		}
	}
}