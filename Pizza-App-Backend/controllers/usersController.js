const User = require("../models/User");

let readUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		// const user = await User.findById(req.params.id).cache({ key: req.params.id });
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

let createUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = new User({ name, email, password });
		const token = await user.generateAuthToken();
		await user.save();
		res.status(201).send({
			user,
			token,
			expiresIn: 3600,
		});
	} catch (error) {
		res.status(400).send(error.message);
	}
};

let loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.status(200).send({
			user,
			token,
			expiresIn: 3600,
		});
	} catch (error) {
		res.status(400).send(error.message);
		console.log(error);
	}
};

let emailChecker = async (req, res) => {
	try {
		const email = req.body.email;
		const count = await User.countDocuments({ email });
		if (count > 0) {
			res.status(200).send(true);
		} else {
			res.status(200).send(false);
		}
	} catch (error) {
		res.send(error.message);
	}
};

module.exports = {
	readUser,
	createUser,
	loginUser,
	emailChecker,
};
