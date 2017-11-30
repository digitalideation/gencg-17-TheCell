let options = {
	squareLength: 75,
	squareWidth: 50,
	squareFillColor: [0, 0, 0], //RGB
	backgroundColor: [150, 165, 165], //RGB
};

window.somethingChanged = true;
let controllers = [];

window.onload = function()
{
	window.gui = new dat.GUI();
	window.gui.closed = true;

	controllers.push(window.gui.add(options, 'squareLength').min(1).max(200).step(1));
	controllers.push(window.gui.add(options, 'squareWidth').min(1).max(200).step(1));
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