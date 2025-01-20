const wss = Bun.serve({
    port: 3000,
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        message(ws, message) {
            console.log("Message received from client:", message);
            ws.send("A message is received.");
        },
        open(ws) {
            console.log("A socket is opened.");
            ws.send("A socket is opened.");
        },
        close(ws, code, message) {
            console.log(
                `A socket is closed with code ${code} and message ${message}.`
            );
        },
        drain(ws) {
            console.log("The socket is ready to receive more data.");
        },
    },
});

console.log(`Listening on ws://localhost:3000...`);
