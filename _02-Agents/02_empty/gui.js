let options = {
	randomSeed: 2018,
	numberOfAgents: 10,
	moveSpeed: 2,
	// maxSpeed: 5,
	agentFatness: 3,
	// turnRadius: Math.PI/32,
	timeToLive: 100,
	tileSize: 150,
	agentColor: [0, 0, 0], //RGB
	backgroundColor: [255, 255, 255], //RGB
	backgroundAlpha: 0, //RGB
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
						.max(10)
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
	// let turnRadius = window
	// 					.gui
	// 					.add(options, 'turnRadius')
	// 					.min(0)
	// 					.max(PI/2)
	// 					.step(Math.PI/128);
	let timeToLive = window
						.gui
						.add(options, 'timeToLive')
						.min(1)
						.max(1000)
						.step(1);
	let tileSize = window
						.gui
						.add(options, 'tileSize')
						.min(50)
						.max(1000)
						.step(1);
	controllers.push(randomSeedOpt);
	controllers.push(numberOfAgents);
	controllers.push(agentFatness);
	// controllers.push(turnRadius);
	controllers.push(timeToLive);
	controllers.push(tileSize);
	// controllers.push(moveSpeed);
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
	tileSize.onChange( resetAgents );

	function resetAgents ()
	{
		agents = [];

		background(options.backgroundColor);

		randomSeed(options.randomSeed);

		for (let y = 0; y * options.tileSize < windowHeight; y++)
		{
			for(let x = 0; x * options.tileSize < windowWidth; x++)
			{
				let agent;
				let startX;
				let startY;

				startX = x * options.tileSize + options.tileSize / 2;
				startY = y * options.tileSize + options.tileSize / 2;
				for (let i = 0; i < options.numberOfAgents; i++)
				{
					agent = new Agent(startX, startY);
					agents.push(agent);
				}
			}
		}
	}
};