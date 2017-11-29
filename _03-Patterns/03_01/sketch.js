"use strict";

// Global var

function setup()
{
	// Canvas setup
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("p5Container");
	// Detect screen density (retina)
	var density = displayDensity();
	pixelDensity(density);

	let topLeft = createVector(50, 50);
	let bottomRight = createVector(200, 200);

	drawSquareOrRecurse(options.minimumSquareSizePx, topLeft, bottomRight);
}

function draw()
{

}

function drawSquareOrRecurse(minSquareSize, topLeftVec, bottomRightVec)
{
	if (topLeftVec.x - bottomRightVec.x < minSquareSize)
	{
		stroke(options.squareFillColor);
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