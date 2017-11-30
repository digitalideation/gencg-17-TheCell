"use strict";

// Global var
let topLeft;
let bottomRight;
let diagSize = Math.sqrt(
		options.squareLength * options.squareLength
		+ options.squareWidth * options.squareWidth)

function setup()
{
	// Canvas setup
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("p5Container");
	// Detect screen density (retina)
	var density = displayDensity();
	pixelDensity(density);

	topLeft = createVector(0, 0);
	bottomRight = createVector(options.squareLength, options.squareWidth);

	background(options.backgroundColor);

}

function draw()
{
	if (window.somethingChanged)
	{
		background(options.backgroundColor);
		let verticalAmount = windowHeight / options.squareWidth;
		for (let i = 0; i < verticalAmount; i++)
		{
			drawRectLine(0, options.squareWidth * i, windowWidth);
		}
		window.somethingChanged = false;
	}
}

function drawRectLine(startX, startY, endX)
{
	let rectAmount = (endX - startX) / diagSize;
	rectAmount = Math.ceil(rectAmount);
	console.log(rectAmount);

	let rowTopLeftVec = topLeft;
	let rowBottomRightVec = bottomRight;

	rowTopLeftVec.x = startX;
	rowBottomRightVec.x = startX + options.squareLength;
	rowTopLeftVec.y = startY;
	rowBottomRightVec.y = startY + options.squareWidth;

	for (let i = 0; i < rectAmount + 1; i++)
	{
		let currentDegree = lerp(0, 90, 1 / rectAmount * i);
		drawRectWithAngle(rowTopLeftVec, rowBottomRightVec, currentDegree);
		rowTopLeftVec.x += options.squareLength;
		rowBottomRightVec.x += options.squareLength;
	}
}

function drawRectWithAngle(topLeftVec, bottomRightVec, rotDegree)
{
	push();
	// rotation math, rotate around center
	translate(
		topLeftVec.x + (bottomRightVec.x - topLeftVec.x) / 2,
		topLeftVec.y + (bottomRightVec.y - topLeftVec.y) / 2
	);
	rotate(radians(rotDegree));
	translate(
		-topLeftVec.x - (bottomRightVec.x - topLeftVec.x) / 2,
		-topLeftVec.y - (bottomRightVec.y - topLeftVec.y) / 2
	);

	// draw and fill
	//stroke(options.backgroundColor);
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
	pop();
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