const Menu = require("../models/Menu");

let getMenus = async (req, res) => {
	try {
		// const menu = await Menu.find({}).cache({ key: "menu" });
		const menu = await Menu.find({});
		res.status(200).send(menu);
	} catch (error) {
		res.status(500).send(error.error);
	}
};

let postMenu = async (req, res) => {
	try {
		const image = `/${req.file.path}`;
		let { name, size, price } = req.body;
		price = +price;
		const menu = new Menu({
			name,
			price,
			size,
			image,
		});
		await menu.save();
		res.status(201).send(menu);
	} catch (error) {
		res.status(400).send(error.error);
	}
};

let getMenu = async (req, res) => {
	try {
		const menu = await Menu.findById(req.params.id).cache({ key: req.params.id });
		if (!menu) {
			return res.status(404).send("No Item Found");
		}
		res.status(200);
		res.send(menu);
	} catch (error) {
		res.status(400).send(error.error);
	}
};

let deleteMenu = async (req, res) => {
	try {
		const menu = await Menu.findByIdAndDelete(req.params.id);
		if (!menu) {
			res.status(404).send("Item Not Found");
		}
		res.status(200);
		res.send(menu);
	} catch (error) {
		res.status(400).send(error.error);
	}
};

let updateMenu = async (req, res) => {
	try {
		let image = req.body.image;
		if (req.file) {
			image = `/${req.file.path}`;
		}
		let { name, price, size } = req.body;
		price = +price;
		const menuData = {
			name,
			size,
			price,
			image,
		};
		const menu = await Menu.findByIdAndUpdate(
			req.params.id,
			{
				$set: menuData,
			},
			{
				new: true,
				omitUndefined: true,
			}
		);
		res.status(200);
		res.send(menu);
	} catch (error) {
		res.status(500).send(error.error);
	}
};

module.exports = {
	getMenus,
	postMenu,
	getMenu,
	deleteMenu,
	updateMenu,
};
