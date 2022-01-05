const fs = require("fs");
const server = require("http").createServer();
server.on("request", (req, res) => {
  //SOLUTION 1 BAD
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  // SOLUTION 2 STREAMS
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  //
  // readable.on("end", () => {
  //   res.end();
  // });
  //
  // readable.on("error", () => {
  //   res.statusCode = 500;
  //   res.end();
  // });

  //SOLUTION 3 PIPE
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
});

server.listen(8000, "127.0.0.0.1", () => {
  console.log("listening....");
});
