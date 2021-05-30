const Order = require("../models/Order");

let getOrder = async (req, res) => {
	try {
		const order = await Order.findOne({
			customerId: req._id,
			_id: req.params.id,
		});
		if (!order) {
			throw new Error("No Order Found");
		}
		res.status(200);
		res.send(order);
	} catch (error) {
		res.status(400).send(error.error);
	}
};

let getOrders = async (req, res) => {
	try {
		const orders = await Order.find(
			{
				customerId: req._id,
			},
			null,
			{
				sort: { createdAt: -1 },
			}
		);

		if (!orders) {
			return res.status(404).send([]);
		}
		res.status(200);
		res.send(orders);
	} catch (error) {
		res.status(500).send(error.error);
	}
};

let postOrders = async (req, res) => {
	try {
		const { items, phone, address } = req.body;
		if (!items || !phone || !address) {
			throw new Error("Please Enter Details For Order");
		}
		const order = new Order({
			customerId: req._id,
			items,
			phone,
			address,
		});
		await order.save();
		const eventEmitter = req.app.get("eventEmitter");
		eventEmitter.emit("Order-Placed", order);
		res.status(201).send(order);
	} catch (error) {
		res.status(500).send(error.error);
	}
};

let getAdminOrders = async (req, res) => {
	try {
		let orders = await Order.find(
			{
				status: {
					$ne: "Completed",
				},
			},
			null,
			{
				sort: { createdAt: -1 },
			}
		).populate("customerId", "-password");
		res.status(200).send(orders);
	} catch (error) {
		res.status(500).send(error.error);
	}
};

let statusUpdate = async (req, res) => {
	try {
		let order = await Order.findByIdAndUpdate(
			{
				_id: req.body.id,
			},
			{
				$set: { status: req.body.status },
			},
			{
				new: true,
				omitUndefined: true,
			}
		);
		const eventEmitter = req.app.get("eventEmitter");
		eventEmitter.emit("Order-Updated", { id: req.body.id, status: req.body.status });
		res.status(200).send(order);
	} catch (error) {
		res.status(500).send(error.error);
	}
};

module.exports = {
	getOrder,
	getOrders,
	postOrders,
	getAdminOrders,
	statusUpdate,
};
