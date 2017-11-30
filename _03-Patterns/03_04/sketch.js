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

		let xStepSize = windowWidth / options.numberOfSquares;
		let yStepSize = windowHeight / options.numberOfSquares;
		let influenceWidth = options.influneceWidthPercent / 100 * windowWidth;
		let leftBorderXPosRelativeToMouse = mouseX - influenceWidth / 2;
		let rightBorderXPosRelativeToMouse = mouseX + influenceWidth / 2;
		let localDegree = 0;

		for (let y = 0; y < options.numberOfSquares + 1; y++)
		{
			for (let x = 0; x < options.numberOfSquares + 1; x++)
			{
				let startPoint = createVector(
					x * xStepSize - (options.squareLength / 2),
					y * yStepSize - (options.squareWidth / 2)
				);
				let endPoint = createVector(
					x * xStepSize + (options.squareLength / 2),
					y * yStepSize + (options.squareWidth / 2)
				);

				if (mouseInputMode == 3)
				{

					if (startPoint.x > leftBorderXPosRelativeToMouse
							&& startPoint.x < rightBorderXPosRelativeToMouse)
					{
						if (startPoint.x < mouseX)
						{
							localDegree = options.rotationDegree - lerp(
								0,
								options.rotationDegree,
								1 / (influenceWidth / 2) * (mouseX - startPoint.x)
							)
							drawRectWithAngle(startPoint, endPoint, localDegree);
						}
						else
						{
							localDegree = options.rotationDegree - lerp(
								0,
								options.rotationDegree,
								1 / (influenceWidth / 2) * (startPoint.x - mouseX)
							)
							drawRectWithAngle(startPoint, endPoint, -localDegree);
						}
					}
					else
					{
						drawRectWithAngle(startPoint, endPoint, 0);
					}
				}
				else
				{
					drawRectWithAngle(startPoint, endPoint, options.rotationDegree);
				}
			}
		}
		window.somethingChanged = false;
	}

	switch (mouseInputMode)
	{
		case 1:
			options.squareLength = lerp(0, windowWidth / (options.numberOfSquares - 3), 1 / windowWidth * mouseX);
			options.squareWidth = lerp(0, windowHeight / (options.numberOfSquares - 3), 1 / windowHeight * mouseY);
			//options.numberOfSquares = lerp(0, 100);
			window.somethingChanged = true;
		break;
		case 2:
			options.rotationDegree = lerp(0, 360, 1 / windowWidth * mouseX);
			window.somethingChanged = true;
		break;
		case 3:
			window.somethingChanged = true;
		break;
		default:
			window.somethingChanged = true;
		break;
	}
}

function drawRectLine(startX, startY, endX)
{
	let rectAmount = (endX - startX) / diagSize;
	rectAmount = Math.ceil(rectAmount);

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
	pop();
}

function keyPressed()
{
	if (key == 's' || key == 'S') saveThumb(650, 350);
	if (key == ' ')
	{
		mouseInputMode ++;
		if (mouseInputMode > 3)
		{
			mouseInputMode = 0;
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