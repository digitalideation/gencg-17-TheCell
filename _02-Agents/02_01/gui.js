let options = {
	randomSeed: 2018,
	numberOfAgents: 100,
	agentColor: [0, 0, 0], //RGB
	backgroundColor: [40, 165, 180], //RGB
};

window.somethingChanged = true;
let controllers = [];

window.onload = function()
{
	window.gui = new dat.GUI();
	window.gui.closed = true;

	controllers.push(window.gui.add(options, 'randomSeed').min(1).max(10000).step(1));
	controllers.push(window.gui.add(options, 'numberOfAgents').min(1).max(2000).step(1));
	controllers.push(window.gui.addColor(options, 'agentColor'));
	controllers.push(window.gui.addColor(options, 'backgroundColor'));

	controllers.forEach( function(element, index, arr)
	{
		element.onChange( function (value)
		{
			window.somethingChanged = true;
		});
	});
};