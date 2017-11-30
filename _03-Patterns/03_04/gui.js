let options = {
	squareLength: 50,
	squareWidth: 50,
	rotationDegree: 45,
	numberOfSquares: 10,
	squareFillColor: [0, 0, 0], //RGB
	backgroundColor: [70, 165, 125], //RGB
};

window.somethingChanged = true;
let controllers = [];

window.onload = function()
{
	window.gui = new dat.GUI();
	window.gui.closed = true;

	controllers.push(window.gui.add(options, 'squareLength').min(1).max(200).step(1));
	controllers.push(window.gui.add(options, 'squareWidth').min(1).max(200).step(1));
	controllers.push(window.gui.add(options, 'numberOfSquares').min(1).max(100).step(1));
	controllers.push(window.gui.add(options, 'rotationDegree').min(0).max(360).step(1));
	controllers.push(window.gui.addColor(options, 'squareFillColor'));
	controllers.push(window.gui.addColor(options, 'backgroundColor'));

	controllers.forEach( function(element, index, arr)
	{
		element.onChange( function (value)
		{
			window.somethingChanged = true;
		});
	});
};