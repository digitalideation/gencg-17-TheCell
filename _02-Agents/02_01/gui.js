let options = {
	randomSeed: 2018,
	numberOfAgents: 50,
	moveSpeed: 2,
	maxSpeed: 5,
	agentFatness: 5,
	turnRadius: Math.PI/32,
	agentColor: [255, 255, 255], //RGB
	backgroundColor: [0, 0, 0], //RGB
	backgroundAlpha: 20, //RGB
};

window.somethingChanged = true;
let controllers = [];

window.onload = function()
{
	window.gui = new dat.GUI();
	window.gui.closed = true;

	let randomSeedOpt = window
						.gui
						.add(options, 'randomSeed')
						.min(1)
						.max(10000)
						.step(1);
	let numberOfAgents = window
						.gui
						.add(options, 'numberOfAgents')
						.min(1)
						.max(2000)
						.step(1);
	let agentFatness = window
						.gui
						.add(options, 'agentFatness')
						.min(1)
						.max(10)
						.step(1);
	let moveSpeed = window
						.gui
						.add(options, 'moveSpeed')
						.min(1)
						.max(5)
						.step(0.1);
	let backgroundAlpha = window
						.gui
						.add(options, 'backgroundAlpha')
						.min(1)
						.max(100)
						.step(1);
	let turnRadius = window
						.gui
						.add(options, 'turnRadius')
						.min(0)
						.max(PI/2)
						.step(Math.PI/128);
	controllers.push(randomSeedOpt);
	controllers.push(numberOfAgents);
	controllers.push(agentFatness);
	controllers.push(turnRadius);
	controllers.push(moveSpeed);
	controllers.push(backgroundAlpha);
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
							random(0, windowHeight),
							15
						);

			agents.push(agent);
		}
	}

	moveSpeed.onChange( function ()
	{
		let moveSpeed = this.object.moveSpeed;
		agents.forEach( function (element, index, arr)
		{
			element.moveSpeed = moveSpeed;
		})
	});

};