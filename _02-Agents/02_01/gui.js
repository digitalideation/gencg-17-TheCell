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

	let randomSeedOpt = window.gui.add(options, 'randomSeed').min(1).max(10000).step(1)
	let numberOfAgents = window.gui.add(options, 'numberOfAgents').min(1).max(2000).step(1)
	controllers.push(randomSeedOpt);
	controllers.push(numberOfAgents);
	controllers.push(window.gui.addColor(options, 'agentColor'));
	controllers.push(window.gui.addColor(options, 'backgroundColor'));

	controllers.forEach( function(element, index, arr)
	{
		element.onChange( function (value)
		{
			window.somethingChanged = true;
		});
	});

	randomSeedOpt.onChange( resetAgents );
	numberOfAgents.onChange( resetAgents );

	function resetAgents ()
	{
		randomSeed(options.randomSeed);
		agents = [];

		for(let i = 0; i < options.numberOfAgents; i++)
		{
			let agent = new Agent(
							random(0, windowWidth),
							random(0, windowHeight)
						);

			agents.push(agent);
		}
	}


};