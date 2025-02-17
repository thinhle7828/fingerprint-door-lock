const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareController")
const router = require("express").Router();


//Register
router.post("/register", authController.registerUser);

//Login
router.post("/login", authController.loginUser);

//REFRESH
router.post("/refresh", authController.requestRefreshToken);

//Log out
router.post("/logout", middlewareController.verifyToken, authController.userLogout);

//changPassword
router.put("/changePassword", middlewareController.verifyToken, authController.changePassword);

module.exports = router;