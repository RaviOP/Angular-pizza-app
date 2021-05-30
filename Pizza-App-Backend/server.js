const express = require("express");
require("./db/mongoose");
// require('./services/cache')
const userRoute = require("./routes/users");
const menuRoute = require("./routes/menus");
const orderRoute = require("./routes/orders");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

const root = path.resolve();

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(root, "/images")));

app.use(userRoute);
app.use(menuRoute);
app.use(orderRoute);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(root, "/Pizza-App-Frontend/dist/Frontend")));

	app.get("*", (req, res) =>
		res.sendFile(path.resolve(root, "Pizza-App-Frontend", "dist", "Frontend", "index.html"))
	);
}

const server = app.listen(PORT, () => {
	console.log(`Server is Up And Running http://localhost:${PORT}`);
});

const EventEmitter = require("events");

const event = new EventEmitter();
app.set("eventEmitter", event);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
	socket.on("join", (name) => {
		socket.join(name);
	});
});

event.on("Order-Updated", (data) => {
	io.to(`Order_${data.id}`).emit("OrderUpdated", data);
});

event.on("Order-Placed", (data) => {
	io.to(`adminRoom`).emit("Order-Placed", data);
});
