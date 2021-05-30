const router = require("express").Router();
const {
	getMenus,
	postMenu,
	getMenu,
	updateMenu,
	deleteMenu,
} = require("../controllers/menuController");
const auth = require("../middlewares/auth");
const cleanMenuCache = require("../middlewares/cleanMenuCache");
const upload = require("../middlewares/multer");

router.get("/api/menus", getMenus);
router.get("/api/menus/:id", getMenu);

router.post("/api/menus", auth, upload, cleanMenuCache, postMenu);
router.put("/api/menus/:id", auth, upload, cleanMenuCache, updateMenu);
router.delete("/api/menus/:id", auth, cleanMenuCache, deleteMenu);

module.exports = router;
