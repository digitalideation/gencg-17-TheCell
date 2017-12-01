"use strict";

// Global var
let topLeft;
let bottomRight;
let diagSize = Math.sqrt(
		options.squareLength * options.squareLength
		+ options.squareWidth * options.squareWidth)
let mouseInputMode = 1;

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

		
		window.somethingChanged = false;
	}

	switch (mouseInputMode)
	{
		case 1:
			window.somethingChanged = true;
		break;
		default:
			window.somethingChanged = true;
		break;
	}
}

function keyPressed()
{
	if (key == 's' || key == 'S') saveThumb(650, 350);
	if (key == ' ')
	{
		mouseInputMode ++;
		if (mouseInputMode > 1)
		{
			mouseInputMode = 1;
		}
	}
	if (key == 'd' || key == 'D')
	{
		options.numberOfSquares ++;
	}
	if (key == 'a' || key == 'A')
	{
		options.numberOfSquares --;
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