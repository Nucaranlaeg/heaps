function newGame(){
	addNewFloor();
	redrawRoomSelector();
}

function getRewards(level){
	adjustStones(level + 1);
	enemyLevel += 0.2;
}

function enemyEscaped(){
	enemyLevel = Math.max(0, enemyLevel - 0.5);
}

function adjustStones(amount){
	if (isNaN(amount) || !isFinite(amount)) return;
	stones += amount;
	document.querySelector("#stones .count").innerHTML = writeNumber(Math.floor(stones), 0);
}

// Time
let lastTick = Date.now();
let tickLength = 1000;
let enemyFrequency = 5000;

// Enemies
let nextEnemy = 0;
let enemyLevel = 0;

// Resources
let stones = 1000;

function tick(){
	if (Date.now() - lastTick < tickLength) return;
	lastTick += tickLength;

	// Enemy actions
	for (let i = spire.length; i--;){
		spire[i].enemy?.process();
	}

	// New enemy
	nextEnemy -= tickLength;
	if (nextEnemy <= 0 && spire[0].enemy === null){
		nextEnemy += enemyFrequency;
		new Enemy(enemyLevel);
	}

	// Spire actions
	for (let i = spire.length; i--;){
		spire[i].process();
	}

	// Update view
	for (let i = spire.length; i--;){
		spire[i].update();
	}

	upgrades.forEach(u => u.testRequirement());
}

setInterval(tick, 100);

setTimeout(() => newGame());