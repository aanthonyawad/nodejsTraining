const EventEmitter = require("events");
const http = require("http");
const myEmitter = new EventEmitter();
myEmitter.on("newSale", () => {
  console.log("Sale!!!!!");
});

myEmitter.on("newSale", () => {
  console.log("Hello Sale!!!!!");
});

myEmitter.on("newSale", (stock) => {
  console.log(`items left in stock ${stock}`);
});

myEmitter.emit("newSale", 9);

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Hello From Server");
});
server.on("request", (req, res) => {
  console.log("Hello From Server 2");
});
server.on("close", () => {
  console.log("Close Server");
});

server.listen(8000, "127.0.0.1", () => {});
console.log("Waiting for requests...");
