var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("index.html");

var SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: "\r\n",
});

var port = new SerialPort("/dev/tty.wchusbserialfa1410", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

var app = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(index);
});

var io = require("socket.io").listen(app);

io.on("connection", function (socket) {
  console.log("Node is listening to port");
});

parser.on("data", function (data) {
  console.log("Received data from port: " + data);
  io.emit("data", data);
});

app.listen(3000);

// 在这里添加前端登录代码
$(function() {
  $('#loginForm').submit(function(event) {
    event.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    const userType = $('#userType').val();

    // 假设此处进行用户认证，验证用户名和密码
    const isAuthenticated = true; // 替换为实际的认证逻辑

    if (isAuthenticated) {
      if (userType === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else if (userType === 'user') {
        window.location.href = 'user-dashboard.html';
      }
    } else {
      alert('Login failed. Please check your credentials.');
    }
  });
});
