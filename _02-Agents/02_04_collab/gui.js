let options = {
	randomSeed: 2018,
	numberOfAgents: 10,
	moveSpeed: 2,
	// maxSpeed: 5,
	agentFatness: 3,
	// turnRadius: Math.PI/32,
	timeToLive: 100,
	tileWidth: 150,
	tileHeight: 150,
	agentColor: [66, 230, 220], //RGB
	backgroundColor: [0, 0, 0], //RGB
	backgroundAlpha: 0, //RGB
	randomPlacement: false, //RGB
	useRadius: false, //RGB
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
		.min(0.5)
		.max(5)
		.step(0.1);
	let backgroundAlpha = window
		.gui
		.add(options, 'backgroundAlpha')
		.min(0)
		.max(100)
		.step(1);
	// let turnRadius = window
		// .gui
		// .add(options, 'turnRadius')
		// .min(0)
		// .max(PI/2)
		// .step(Math.PI/128);
	let timeToLive = window
		.gui
		.add(options, 'timeToLive')
		.min(1)
		.max(1000)
		.step(1);
	let tileWidth = window
		.gui
		.add(options, 'tileWidth')
		.min(50)
		.max(1000)
		.step(1);
	let tileHeight = window
		.gui
		.add(options, 'tileHeight')
		.min(50)
		.max(1000)
		.step(1);
	let randomPlacement = window
		.gui
		.add(options, "randomPlacement");
	let useRadius = window
		.gui
		.add(options, "useRadius");
	controllers.push(randomSeedOpt);
	controllers.push(numberOfAgents);
	controllers.push(agentFatness);
	// controllers.push(turnRadius);
	controllers.push(timeToLive);
	controllers.push(tileWidth);
	controllers.push(tileHeight);
	// controllers.push(moveSpeed);
	controllers.push(backgroundAlpha);
	controllers.push(randomPlacement);
	controllers.push(useRadius);
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
	tileHeight.onChange( resetAgents );
	tileWidth.onChange( resetAgents );

	function resetAgents ()
	{
		agents = [];

		background(options.backgroundColor);

		randomSeed(options.randomSeed);

		for (let y = 0; y * options.tileHeight < windowHeight; y++)
		{
			for(let x = 0; x * options.tileWidth < windowWidth; x++)
			{
				let agent;
				let startX;
				let startY;

				startX = x * options.tileWidth + options.tileWidth / 2;
				startY = y * options.tileHeight + options.tileHeight / 2;
				for (let i = 0; i < options.numberOfAgents; i++)
				{
					agent = new Agent(startX, startY);
					agents.push(agent);
				}
			}
		}
	}
};