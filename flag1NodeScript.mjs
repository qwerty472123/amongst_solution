import fetch from 'node-fetch';
import io from 'socket.io-client';

function assert(condition, message) {
    if (!condition) {
        throw new Error(message ?? "Assertion failed");
    }
}

async function main() {
    // const domain = 'localhost:8080'; // 'ap.amongst.chal.pwni.ng'; // 
    const domain = 'ap.amongst.chal.pwni.ng'; // 'ap.amongst.chal.pwni.ng'; // 
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
    let time = 0;
    let syncEvents = [];

    function updateTick(flush = false) {
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
            localTick = update.tick + 5;
            time = Date.now();
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
            await delay(50);
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

    let times = 5;
    while (true) {
        await waitForSync();
        if (game.level.map !== 'dropship') break;
        await moveTo(27.5, 9, true);
        console.log('spec');
        times--;
        if (times === 0) {
            socket.emit('requestSync');
            times = 5;
        }
        socket.emit('special');
        await delay(200);
    }

    console.log('enter');
    await delay(4000);
    for (let i = 0; i < (1000 / 50 * 3); i++) {
        sendAction({
            delta: [0, 0],
            bonusAction: {
                kind: "Interact",
                system: 4,
                device: "emergency-button"
            }
        })
        await delay(50);
    }

    while (true) {
        socket.emit('special');
        await delay(1000);
    }

}

main();