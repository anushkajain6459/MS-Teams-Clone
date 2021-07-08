// --- Initializing---
const express = require("express");
const app = express();
//---Creating Server---
const server = require("http").Server(app);
//---Using a library -UUID(We need uique IDs for lobby and uuid will generate random IDs ---
//---Importing version v4 of uuid library----
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
// Peer

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
// ----need to setup a public URL for the script (script.js), telling the server that our public files would be here-------
app.use(express.static("public"));
app.use("/peerjs", peerServer);

// ---Redriecting to unqiue id created via uuidv4---
app.get("/", (req, rsp) => {
  rsp.redirect(`/${uuidv4()}`);
});

//---Creating a new URL(Unique ID to be shared), the url generated is rendered here----
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
// using socket io for real time communication...
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});

server.listen(process.env.PORT || 3030 , ()=> 
{
  console.log('server started')
});
