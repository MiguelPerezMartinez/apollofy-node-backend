const { Users } = require("../models");

//POST
async function register(req, res) {
  const { email, ...reqBody } = req.body;
  console.log(reqBody);
  console.log(email);
  //   const { uid, username, email } = req.body;
  try {
    const foundUser = await Users.findOne({
      email: email,
    });
    if (!foundUser) {
      const { _id } = await Users.create({
        email: email,
        ...reqBody,
      });
      return res.status(200).send({
        message: "User created very successfully",
        data: {
          userId: _id,
        },
      });
    } else {
      return res.status(201).send({
        message: "User already exists asshole",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      error: error.message,
    });
  }
}

//PATCH
async function updateById(req, res) {
  const { id } = req.params;
  const bodyReq = req.body;
  try {
    console.log("id => ", id);
    console.log("bodyReq => ", bodyReq);
    const dbResponse = await Users.findByIdAndUpdate(id, bodyReq, {
      new: true,
    });

    if (!dbResponse) {
      return res.status(400).send(
        generateResponse({
          data: null,
          error: "User ID doesn't exist",
        }),
      );
    }

    return res.status(200).send({
      data: dbResponse,
    });
  } catch (error) {
    return res.status(500).send({
      data: req.params.id,
      error: error.message,
    });
  }
}

async function setTrackHistory(req, res) {
  const { id: userId } = req.params;
  const { history } = req.body;
  try {
    const userDoc = await Users.findById(userId);
    userDoc.trackHistory = history;
    userDoc.save();
    // console.log(userDoc.trackHistory);
    return res.status(200).send({
      message: "History saved correctly",
      userId: userId,
      data: history,
    });
  } catch (error) {
    return res.status(500).send({
      userId: userId,
      error: error.message,
    });
  }
}

//GET
async function getById(req, res) {
  const { id: firebase_id } = req.params;
  try {
    const foundUser = await Users.findOne({
      firebase_id: firebase_id,
    });
    return res.status(200).send({
      message: "User found",
      currentUser: foundUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      error: error.message,
    });
  }
}

async function getMyTracksById(req, res) {
  const { id } = req.params;
  try {
    const userDoc = await Users.findById(id).populate("myTracks");

    return res.status(200).send({
      message: "User found",
      data: userDoc.myTracks,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      error: error.message,
    });
  }
}

async function getFavouriteTracksById(req, res) {
  const { id } = req.params;
  try {
    const userDoc = await Users.findById(id).populate("favTracks");

    return res.status(200).send({
      message: `User ${id} favTracks`,
      favTracks: userDoc.favTracks,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      error: error.message,
    });
  }
}
async function getAllMyPlaylists(req, res) {
  const { id } = req.params;
  try {
    const userDoc = await Users.findById(id).populate("myPlaylists");
    return res.status(200).send({
      message: `User ${id} myPlaylists`,
      myPlaylists: userDoc.myPlaylists,
    });
  } catch (error) {
    return res.status(500).send({
      data: req.params.id,
      error: error.message,
    });
  }
}

async function getUserByUsername(req, res) {
  const { username } = req.params;
  try {
    //Collect all users, turn username to
    //lowercase and initialize users to return
    const users = await Users.find({});
    const lwcUsername = username.toLowerCase();
    let usersToReturn = [];

    //Check if username is contained inside users
    for (const user of users) {
      let userDocUsername = user.username.toLowerCase();
      if (userDocUsername.includes(lwcUsername)) {
        usersToReturn.push(user);
      }
    }

    //Return users found
    return res.status(200).send({
      message: "Users found",
      users: usersToReturn,
    });
  } catch (error) {
    return res.status(500).send({
      data: username,
      error: error.message,
    });
  }
}
module.exports = {
  register: register,
  updateProfile: updateById,
  setTrackHistory: setTrackHistory,
  getById: getById,
  getMyTracksById: getMyTracksById,
  getFavouriteTracksById: getFavouriteTracksById,
  getAllMyPlaylists: getAllMyPlaylists,
  getUserByUsername: getUserByUsername,
};
