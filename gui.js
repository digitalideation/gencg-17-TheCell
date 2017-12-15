let options = {
	randomSeed: new Date().getTime() % 100000,
	numberOfAgents: 2,
	moveSpeed: 2,
	// maxSpeed: 5,
	agentFatness: 3,
	// turnRadius: Math.PI/32,
	timeToLive: 100,
	// tileWidth: 200,
	// tileHeight: 200,
	tileWidth: 150,
	tileHeight: 150,
	agentColor: [66, 230, 220], //RGB
	backgroundColor: [0, 0, 0], //RGB
	backgroundAlpha: 30, //0 - 100
	randomPlacement: false,
	useRadius: false,
	sendToNeighbor: true,
	bounceOffWindowBorder: true,
	bounceOffLocalBorder: false,
};