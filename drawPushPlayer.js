// Firstly, run this code in Devtools
let hooked = Object.getPrototypeOf(FileTransferController).prototype.detach;
globalThis.leakOut = [];
Object.getPrototypeOf(FileTransferController).prototype.detach = function (...args) {
	globalThis.leakOut = args;
	return hooked.apply(this, args);
};

// After close any panel, you can run the code below, and see BFS result in a newly opened window
let [game, self] = globalThis.leakOut;
let win = open('about:blank');
win.document.write('<canvas id="can"></canvas>');
let can = win.document.getElementById('can');
can.style.height = '100%';
can.style.width = '100%';
let cc = can.getContext("2d");
let acc = 10;
can.width = (game.level.map.bounds.bottomRight.x - game.level.map.bounds.topLeft.x) * acc;
can.height = (game.level.map.bounds.bottomRight.y - game.level.map.bounds.topLeft.y) * acc;
function convertAxis(x, y) {
	return [(x - game.level.map.bounds.topLeft.x) * (can.width / (game.level.map.bounds.bottomRight.x - game.level.map.bounds.topLeft.x)), (y - game.level.map.bounds.topLeft.y) * (can.height / (game.level.map.bounds.bottomRight.y - game.level.map.bounds.topLeft.y))];
}
function drawDot(x, y) {
	[x, y] = convertAxis(x, y);
	cc.beginPath();
	cc.fillRect(x, y, 1, 1);
}
let delta = 1 / acc;
let Point = Object.getPrototypeOf(self.location);
function getPush(x, y) {
	let p = new Point.constructor(x, y);
	p = game.level.map.applyWalls(p);
	p = game.level.map.applyBounds(p);
	return [p.x, p.y];
}
let visited = new Set();
let queue = [];
queue.push([0, 110]);
let marks = [];
for (let qi = 0; qi < queue.length; qi++) {
	if (qi.length > 1200 * 870) break;
	if (qi.length % 10000 == 0) console.log(qi);
	let [x, y] = queue[qi];
	for (let i = -0.5 * acc; i <= 0.5 * acc; i++) {
		for (let j = -0.5 * acc; j <= 0.5 * acc; j++) {
			if (Math.sqrt(i * i + j * j) <= (0.5 + 1e-8) * acc) {
				let nx = x + i, ny = y + j;
				let hash = nx + '_' + ny;
				if (visited.has(hash)) continue;
				[nx, ny] = getPush(nx * delta, ny * delta);
				nx *= acc; ny *= acc;
				let cx = nx, cy = ny;
				nx = Math.round(cx);
				ny = Math.round(cy);
				if (cx != nx || cy != ny) {
					marks.push([[cx, cy], [nx, ny]]);
				}
				hash = nx + '_' + ny;
				if (visited.has(hash)) continue;
				visited.add(hash);
				queue.push([nx, ny]);
			}
		}
	}
}
for (let qi = 0; qi < queue.length; qi++) {
	if (qi.length > 1200 * 870) break;
	if (qi.length % 10000 == 0) console.log(qi);
	let [x, y] = queue[qi];
	{
		let i = (-0.5-1e-8) * acc, j = 0;
		let nx = x + i, ny = y + j;
		let hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		[nx, ny] = getPush(nx * delta, ny * delta);
		nx *= acc; ny *= acc;
		let cx = nx, cy = ny;
		nx = Math.round(cx);
		ny = Math.round(cy);
		if (cx != nx || cy != ny) {
			marks.push([[cx, cy], [nx, ny]]);
		}
		hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		visited.add(hash);
		queue.push([nx, ny]);
	}
	{
		let j = (0.5+1e-8) * acc, i = 0;
		let nx = x + i, ny = y + j;
		let hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		[nx, ny] = getPush(nx * delta, ny * delta);
		nx *= acc; ny *= acc;
		let cx = nx, cy = ny;
		nx = Math.round(cx);
		ny = Math.round(cy);
		if (cx != nx || cy != ny) {
			marks.push([[cx, cy], [nx, ny]]);
		}
		hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		visited.add(hash);
		queue.push([nx, ny]);
	}
	{
		let i = (0.5+1e-8) * acc, j = 0;
		let nx = x + i, ny = y + j;
		let hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		[nx, ny] = getPush(nx * delta, ny * delta);
		nx *= acc; ny *= acc;
		let cx = nx, cy = ny;
		nx = Math.round(cx);
		ny = Math.round(cy);
		if (cx != nx || cy != ny) {
			marks.push([[cx, cy], [nx, ny]]);
		}
		hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		visited.add(hash);
		queue.push([nx, ny]);
	}
	{
		let j = (-0.5-1e-8) * acc, i = 0;
		let nx = x + i, ny = y + j;
		let hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		[nx, ny] = getPush(nx * delta, ny * delta);
		nx *= acc; ny *= acc;
		let cx = nx, cy = ny;
		nx = Math.round(cx);
		ny = Math.round(cy);
		if (cx != nx || cy != ny) {
			marks.push([[cx, cy], [nx, ny]]);
		}
		hash = nx + '_' + ny;
		if (visited.has(hash)) continue;
		visited.add(hash);
		queue.push([nx, ny]);
	}
}
for (let [x, y] of queue) {
	drawDot(x / acc, y / acc);
}

// And then, you can run these code to get the black-red-green pushWall picture
cc.clearRect(0, 0, can.width, can.height);
for (let i = game.level.map.bounds.topLeft.x; i <= game.level.map.bounds.bottomRight.x; i += delta) {
	for (let j = game.level.map.bounds.topLeft.y ; j <= game.level.map.bounds.bottomRight.y; j += delta) {
		let o = new Point.constructor(i, j);
		p = game.level.map.applyWalls(o);
		p = game.level.map.applyBounds(p);
		cc.fillStyle = '#000000';
		drawDot(p.x, p.y);
	}
}
for (let i = game.level.map.bounds.topLeft.x; i <= game.level.map.bounds.bottomRight.x; i += delta) {
	for (let j = game.level.map.bounds.topLeft.y ; j <= game.level.map.bounds.bottomRight.y; j += delta) {
		let o = new Point.constructor(i, j);
		p = game.level.map.applyWalls(o);
		p = game.level.map.applyBounds(p);
		let p2 = game.level.map.applyWalls(p);
		p2 = game.level.map.applyBounds(p2);
		if (p2.equals(p)) continue;
		cc.fillStyle = 'red';
		drawDot(o.x, o.y);
		cc.fillStyle = 'green';
		drawDot(p.x, p.y);
	}
}
