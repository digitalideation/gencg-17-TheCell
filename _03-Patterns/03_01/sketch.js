"use strict";

// Global var
let topLeft;
let bottomRight;

function setup()
{
	// Canvas setup
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("p5Container");
	// Detect screen density (retina)
	var density = displayDensity();
	pixelDensity(density);
	topLeft = createVector(50, 50);
	bottomRight = createVector(200, 200);
}

function draw()
{
	clear();
	randomSeed(options.randomSeed);
	drawSquareOrRecurse(options.minimumSquareSizePx, topLeft, bottomRight);
}

function drawSquareOrRecurse(
	minSquareSize,
	topLeftVec,
	bottomRightVec)
{
	if (bottomRightVec.x - topLeftVec.x < minSquareSize)
	{
		stroke(options.squareLineColor);
		fill(options.squareFillColor);
		quad(
			topLeftVec.x,
			topLeftVec.y,
			bottomRightVec.x,
			topLeftVec.y,
			bottomRightVec.x,
			bottomRightVec.y,
			topLeftVec.x,
			bottomRightVec.y
		);
	}
	else
	{
		if (random(0, 1) < options.randomThreshold)
		{
			// split into 4 subsquares
			// top left
			drawSquareOrRecurse(
				minSquareSize,
				topLeftVec,
	 			createVector(
					topLeftVec.x + Math.floor((bottomRightVec.x - topLeftVec.x) / 2),
					topLeftVec.y + Math.floor((bottomRightVec.y - topLeftVec.y ) / 2)
				)
			);
		}
		else
		{
			drawSquareOrRecurse(
				minSquareSize,
				topLeftVec,
	 			createVector(
					topLeftVec.x + Math.floor((bottomRightVec.x - topLeftVec.x) / 2),
					topLeftVec.y + Math.floor((bottomRightVec.y - topLeftVec.y ) / 2)
				)
			);
		}
		if (random(0, 1) < options.randomThreshold)
		{
			// top right
			drawSquareOrRecurse(
				minSquareSize,
				createVector(
					topLeftVec.x + Math.floor((bottomRightVec.x - topLeftVec.x) / 2),
					topLeftVec.y
				),
				createVector(
					bottomRightVec.x,
					topLeftVec.y + Math.floor((bottomRightVec.y - topLeftVec.y) / 2)
				)
			);
		}
		else
		{

		}
		if (random(0, 1) < options.randomThreshold)
		{
			// bottom right
			drawSquareOrRecurse(
				minSquareSize,
				createVector(
					topLeftVec.x + Math.floor((bottomRightVec.x - topLeftVec.x) / 2),
					topLeftVec.y + Math.floor((bottomRightVec.y - topLeftVec.y) / 2)
				),
				bottomRightVec
			);
		}
		else
		{

		}
		if (random(0, 1) < options.randomThreshold)
		{
			// bottom left
			drawSquareOrRecurse(
				minSquareSize,
				createVector(
					topLeftVec.x,
					topLeftVec.y + Math.floor((bottomRightVec.y - topLeftVec.y) / 2)
				),
				createVector(
					topLeftVec.x + Math.floor((bottomRightVec.x - topLeftVec.x) / 2),
					bottomRightVec.y
				)
			);
		}
		else
		{

		}
	}
}

function keyPressed()
{
	if (key == 's' || key == 'S') saveThumb(650, 350);
}

// Tools

// resize canvas when the window is resized
function windowResized()
{
	resizeCanvas(windowWidth, windowHeight, false);
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