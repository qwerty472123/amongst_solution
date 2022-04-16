// Local script
// Go to the position and run 
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
	let u1 = null;
	function sendAction(action) {
		if (u1 === null) {
			u1 = Math.round(self.tick);
		}
		u1++;
		self.socket.emit("action", {
			syncId: self.syncId,
			tick: u1,
			action: action
		}, realSym);
	}

	await delay(50);
	sendAction({
		delta: [0, 0],
		bonusAction: { "kind": "Kill", "target": game.others.get(Array.from(game.others.keys()).pop()).id, "at": [27.5, 9] }
	});
	self.location = new Point.constructor(27.5, 9);
	for (let i = 0; i < 50; i++) {
		console.log(i);
		sendAction({
			delta: [0, -0.5 - 1e-8]
		}); await delay(20);
		u1--;
		//self.location.y -= 0.5+1e-8;
	}
	console.log('fine');
	self.socket.emit = realEmit;
	self.socket.emit('requestSync');
}
main();


// Remote script
// Run firstly
let hooked = Object.getPrototypeOf(FileTransferController).prototype.detach;
globalThis.leakOut = [];
Object.getPrototypeOf(FileTransferController).prototype.detach = function (...args) {
	globalThis.leakOut = args;
	return hooked.apply(this, args);
};

// Open and close the emergency button, and run following.
// And goto the position and press the K key to kill.
[game, self] = globalThis.leakOut;
Point = Object.getPrototypeOf(game.self.location);
game.others.get(Array.from(game.others.keys()).pop()).__defineGetter__('location', () => new Point.constructor(27.5, 9));
game.others.get(Array.from(game.others.keys()).pop()).__defineSetter__('location', () => 0);
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
			let ret = realEmit.apply(this, [act, obj]);;
			if (act === 'action' && obj?.action?.bonusAction?.kind === "Kill") {
				(async function () {
					for (let i = 0; i < 50; i++) {
						console.log(i);
						self.socket.emit("action", {
							syncId: obj.syncId,
							tick: obj.tick + 1,
							action: {
								delta: [0, -0.5 - 1e-8]
							}
						}, realSym); await delay(20);
					}
					console.log('fine');
					self.socket.emit = realEmit;
					self.socket.emit('requestSync');
				})();
			}
			return ret;
		}
	}
}
main();

// PCTF{dont_go_lyin_2_me__i_saw_a_body_lyin_there_5d4867fab62c883b5c74}
// PCTF{can_you_make_it_2_for_2?_956b6edc1825d577e98e}
