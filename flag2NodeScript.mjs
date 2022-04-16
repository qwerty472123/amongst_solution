import fetch from 'node-fetch';
import io from 'socket.io-client';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message ?? "Assertion failed");
    }
}

async function main() {
    // const domain = 'localhost:8080';
    const domain = 'ap.amongst.chal.pwni.ng';
    assert(process.argv.length === 3, "Usage: node test.mjs <roomId>");
    let roomId = process.argv[2];
    let res = await fetch('http://' + domain + '/api/info/' + roomId);
    let props = await res.json();
    console.log(props)
    const url = `ws://${props.host || domain.split(':').shift()}:${props.port}`;
    const socket = io(url, {
        transports: ["websocket"],
        query: {
            game: roomId,
            name: "Special"
        }
    });
    await new Promise((resolve, reject) => {
        socket.on('connect', resolve);
        socket.on('error', reject);
    });
    console.log('hi')
    setInterval(() => socket.emit("ping", () => null), 2000);
    let game = null;
    let localTick = 0;
	let masked = false;
    let time = 0;
    let syncEvents = [];

    function updateTick(flush = false) {
		if (masked) {
			localTick += 1;
			return;
		}
        let nt = Date.now();
        let delta = Math.round((nt - time) / 50);
        if (flush && delta < 1) delta = 1;
        localTick += delta;
        time = nt;
    }

    function waitForSync() {
        return new Promise(resolve => {
            syncEvents.push(resolve);
        });
    }

    socket.on('sync', (sync) => {
        game = sync;
        console.log('sync', game.self.id);
        localTick = game.nextPlayableTick + 10;
        time = Date.now();
        for (let event of syncEvents) event();
        syncEvents = [];
    });

    socket.on('update', (update) => {
        if (update.tick >= localTick) {
            localTick = update.tick + 1;
            time = Date.now();
        }
		for (let v of update.updates) {
			if (v.kind === "SatelliteUpdate") {
				console.log(v);
			}
		}
    });

    socket.emit('join');
    console.log('dd');

    async function delay(time) {
        await new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }

    function sendAction(action) {
        updateTick(true);
        socket.emit("action", {
            syncId: game.id,
            tick: Math.round(localTick),
            action: action
        });
    }

    async function moveToS(x, idx) {
        let limit = 0.5; // + 1e-8;
        while (game.self.location[idx] !== x) {
            let delta = Math.min(limit, Math.max(-limit, x - game.self.location[idx]));
            let deltas = [0, 0];
            deltas[idx] = delta;
            sendAction({
                delta: deltas
            });
            game.self.location[idx] += delta;
            console.log(game.self.location, deltas);
            if (!masked) await delay(50);
        }
    }

    async function moveTo(x, y, orderSwap = false) {
        if (orderSwap) {
            await moveToS(y, 1);
            await moveToS(x, 0);
        } else {
            await moveToS(x, 0);
            await moveToS(y, 1);
        }
    }

    socket.on("hello", (data) => {
        console.log(data);
    });

    // while (true) {
    //     await waitForSync();
    //     if (game.level.map !== 'dropship') break;
    //     await delay(200);
    // }

    // console.log('enter');
    // await delay(7000);
    await waitForSync();
    await moveToS(22, 0);
    await moveToS(19, 1);
	await moveToS(24.5-1e-9, 0);
	
    //await moveToS(15-1e-13, 1);
    //await moveToS(1e-13, 0);


    //await delay(50);
	masked = true;
    for (let i = 0; i < Math.ceil(1 / 0.00009) + 10; i++) {
		sendAction({
		   delta: [0.00009, 0.5+1e-9]
		});
		await delay(10);
	}
	
	game.self.location[0] = 24.5 + 1e-9;
	game.self.location[1] = 19.5;
	await moveToS(38, 1);
	await moveToS(-37.5, 0);
	sendAction({
		"delta": [
			0,
			0
		],
		"bonusAction": {
			"kind": "Interact",
			"system": 10,
			"device": "satellite"
		}
	});
    //[22, 18.7]

    //for (let i = 0; i < 10; i++) {
    //    socket.emit('special');
    //    await delay(100);
    //}

    while (true) {
        await delay(1000);
    }

    //socket.disconnect();

}

main();

// PCTF{where_no_shipmate_has_gone_before!_74586b74687c845a159c}
// PCTF{can_you_make_it_2_for_2?_956b6edc1825d577e98e}