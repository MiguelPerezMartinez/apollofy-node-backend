const Router = require("express").Router;
const userRouter = Router();
const { userController } = require("../controllers");
const { authMiddleware } = require("../middlewares");

//end points routes:
//POST
userRouter.post("/register", userController.register);

//PATCH
userRouter.patch(
  "/update-user/:id",
  authMiddleware,
  userController.updateProfile,
);
userRouter.patch(
  "/set-track-history/:id",
  authMiddleware,
  userController.setTrackHistory,
);

//GET
userRouter.get("/get-user/:id", authMiddleware, userController.getById);
userRouter.get(
  "/get-user/:id/my-tracks",
  authMiddleware,
  userController.getMyTracksById,
);
userRouter.get(
  "/get-user/:id/favourite-tracks",
  authMiddleware,
  userController.getFavouriteTracksById,
);
userRouter.get(
  "/get-user/:id/my-playlists",
  authMiddleware,
  userController.getAllMyPlaylists,
);
userRouter.get(
  "/get-user-by-username/:username",
  // authMiddleware,
  userController.getUserByUsername,
);

module.exports = userRouter;
