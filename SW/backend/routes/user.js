const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();


//GET ALL USERS
router.get("/",middlewareController.verifyToken, userController.getAllUsers);
//DELETE USERS
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUsers);

router.put("/:id", middlewareController.verifyTokenAndAdminAuth, userController.updateUserStatus);

module.exports = router;