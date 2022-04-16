let hooked = Object.getPrototypeOf(FileTransferController).prototype.detach;
globalThis.aa = [];
Object.getPrototypeOf(FileTransferController).prototype.detach = function (...args) {
	globalThis.aa = args;
	return hooked.apply(this, args);
};



let hooked2 = Object.getPrototypeOf(game.self.controller).partialAdvance;
Object.getPrototypeOf(game.self.controller).partialAdvance = function (g, s, a, f, p, i, k, r) {
	if (!globalThis.leakout) console.log('bingo');
	globalThis.leakout = [g, s];
	if (globalThis.killpts && f) {
		console.log('kill');
		[game, self] = [g, s];
		self.socket.emit("action", {
			syncId: self.syncId,
			tick: Math.round(self.tick),
			action: {
				delta: [0, 0],
				bonusAction: {
					kind: "Kill",
					target: globalThis.killpts.id,
					at: globalThis.killpts.pt
				}
			}
		});
		//self.socket.emit("requestSync");
		globalThis.killpts = null;
		return hooked2.apply(this, [g, s, a, false, p, i, k, r]);
	}
	return hooked2.apply(this, [g, s, a, f, p, i, k, r]);
}

[game, self] = globalThis.aa;
Point = Object.getPrototypeOf(game.self.location);

let aaxx = self.socket.emit;
self.socket.emit = function (a, b, ...args) {
	let ret = aaxx.apply(this, [a, b, ...args]);
	if (b.action && b.action.bonusAction && b.action.bonusAction.kind === "Kill") {
		let tt = b.tick;
		let uu = 5;
		while (uu > 0) {
			tt++; uu--; b.tick++;
			self.location.y += -0.5 - 1e-8;
			aaxx.call(this, a, {
				syncId: self.syncId,
				tick: tt,
				action: {
					delta: [0, -0.5 - 1e-8]
				}
			});
		}
	}
	return ret;
}

Point = Object.getPrototypeOf(game.self.location)
game.others.get(Array.from(game.others.keys()).pop()).__defineGetter__('location', () => new Point.constructor(27.5, 9));
game.others.get(Array.from(game.others.keys()).pop()).__defineSetter__('location', () => 0);

Point = Object.getPrototypeOf(game.self.location);
async function main() {
	async function delay(time) {
		await new Promise(resolve => {
			setTimeout(resolve, time);
		});
	}
	let realEmit = self.socket.emit;
	let realSym = Symbol('realEmit');
	self.socket.emit = function (act, obj, real) {
		if (real === realSym || act !== 'action') {
			return realEmit.apply(this, [act, obj]);
		} else {
			console.log('junk', act, obj);
		}
	}
	function sendAction(action) {
		self.tick += 3;
		self.socket.emit("action", {
			syncId: self.syncId,
			tick: Math.round(self.tick),
			action: action
		}, realSym);
	}

	await delay(50);
	sendAction({
		delta: [0, 0],
		bonusAction: { "kind": "Kill", "target": game.others.get(Array.from(game.others.keys()).pop()).id, "at": [27.5, 9] }
	});
	self.location = new Point.constructor(27.5, 9);
	for (let i = 0; i < 10; i++) {
		console.log(i);
		sendAction({
			delta: [0, -0.5 - 1e-8]
		});
		await delay(5);
		self.location.y -= 0.5 + 1e-8;
	}
	console.log('fine');
	self.socket.emit = realEmit;
}
main();


console.log(game.self.location);
let hooked5 = Object.getPrototypeOf(game.self.controller).advance;
Object.getPrototypeOf(game.self.controller).advance = function (g, s, a, p, ...args) {
	if (globalThis.bb) p = globalThis.bb;
	return hooked5.apply(this, [g, s, a, p, ...args]);
}
copy(JSON.stringify([game.self.location.x, game.self.location.y]))
bb = new Point.constructor(5, 0);
[28.99697971162969, 0.20559663700139358]


self.socket.emit("action", {
	syncId: self.syncId,
	tick: Math.round(self.tick) + 1,
	action: {
		delta: [0, 0],
		bonusAction: {
			kind: "Kill",
			target: 3,
			at: new Point.constructor(28.99697971162969, 0.20559663700139358)
		}
	}
});

let hooked6 = Object.getPrototypeOf(game.self.controller).advance;
Object.getPrototypeOf(game.self.controller).advance = function (g, s, a, p, i, k, r) {
	if (globalThis.bb) {

		p = globalThis.bb;
		k = true;
	}
	return hooked6.apply(this, [g, s, a, p, i, k, r]);
}

{ "x": 28.95685644641897, "y": 0.18553500439603368 }
bb = new Point.constructor(28.95685644641897, 0.18553500439603368);

game.self.controller.advance(game, self, 1, (new Point.constructor(0.5, 0.5)).unit().scale(0.5), false, false, false)

game.self.controller.state.devices[0] = 'conspiracy-board'
game.self.controller.state.devices[0] = 'satellite'
game.level.map.devices.get('conspiracy-board').graphics.hideInDark = false;
game.level.map

game.level.systems.get(6).devices[0] = 'conspiracy-board'
game.level.systems.get(6).devices = 'vent-communications'

let hooked2 = game.self.controller.partialAdvance;
game.self.controller.partialAdvance = function (...args) {

	if (args.slice(-3).some(x => x)) console.log(args);
	return hooked2.apply(this, args);
};

let hooked3 = game.self.controller.advance;
game.self.controller.advance = function (...args) {

	if (args.slice(-3).some(x => x)) console.log(args);
	return hooked3.apply(this, args);
};