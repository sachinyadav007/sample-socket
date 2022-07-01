const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: [ 'polling','websocket'],
        credentials: true
    },
    allowEIO3: true
});
const path = require("path")

app.set('view engine', 'ejs');
// app.use(express.static('public'))
app.get("/socket-page", (req, res) => {
    res.render('index', {foo: 'FOO'});
})

app.get("/testing-remote-connection", (req, res) => {
    res.send("it worked");
})

let dummyLiveDeal = {
    url: "myntra-mega-clearance-sale-offer-coupon",
    collectionId: "somegibberishhere",
    status: 4,
    dealInfo: {
        title: "Pichkari offer",
        offerPrice: 1000,
        image: "https://gpcdn.ams3.cdn.digitaloceanspaces.com/ddhomebanner/mothersparsh-app-noti-02022022.jpg",
        cashback: 6
    }
}


io.of("/live-deal").on("connection", (socket) => {
    console.log("socket connetion", socket)

    socket.on("send-live-deal", (data) => {
        console.log("received data", data)
        
        io.of("/live-deal")
            .to(socket.id)
            .emit("live-deal", dummyLiveDeal);

    });

    io.of("/live-deal")
        .to(socket.id)
        .emit("live-deal", dummyLiveDeal);

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// app.listen(8000,() => {
//     console.log("server listening on port 8000")
// })