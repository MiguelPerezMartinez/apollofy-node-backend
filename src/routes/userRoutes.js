const Router = require("express").Router;
const userRouter = Router();
const { userController } = require("../controllers");
const { authMiddleware } = require("../middlewares");

//end points routes:
userRouter.post("/register", userController.register);
userRouter.get("/get-user/:id", authMiddleware, userController.getById);
userRouter.patch(
  "/update-user/:id",
  authMiddleware,
  userController.updateProfile,
);

module.exports = userRouter;
