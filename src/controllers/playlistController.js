// imports
const { Tracks, Users, Playlists } = require("../models");

// functions

//POST
async function createPlaylist(req, res) {
  const { title, owner, ...bodyReq } = req.body;
  try {
    const foundPlaylist = await Playlists.findOne({ title: title });
    if (!foundPlaylist) {
      //Create playlist
      const { _id } = await Playlists.create({
        title: title,
        owner: owner,
        ...bodyReq,
      });

      //Finding the user to update myPlaylists property and saving the document
      const userFound = await Users.findById(owner);
      userFound.myPlaylists.push(_id);
      await userFound.save();

      //Returning status after playlist creation and user document update
      return res.status(200).send({
        message: "Playlist created very successfully",
        playlistId: _id,
      });
    } else {
      return res.status(201).send({
        message: "This playlist already exists",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      error: error.message,
    });
  }
}

//UPDATE
async function updatePlaylistById(req, res) {
  const { id } = req.params;
  try {
    const dbResponse = await Playlists.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!dbResponse) {
      return res.status(400).send({
        data: null,
        error: "Playlist ID doesn't exist",
      });
    } else {
      return res.status(200).send({
        message: "Playlist updated successfully",
        updatedPlaylist: dbResponse,
      });
    }
  } catch (error) {
    return res.status(500).send({
      data: req.params.id,
      error: error.message,
    });
  }
}

async function handlerPlaylistLike(req, res) {
  const { playlistId, userId } = req.body;
  let messageResponse = "";
  try {
    // Collect both documents: playListDoc and userDoc by id's
    const playListDoc = await Playlists.findById(playlistId);
    const userDoc = await Users.findById(userId);

    // Check if the like is registered in both documents
    const userIndex = playListDoc.totalLikes.indexOf(userId);
    const playlistIndex = userDoc.favPlaylists.indexOf(playlistId);

    // Do handling action
    if (userIndex >= 0 && playlistIndex >= 0) {
      messageResponse = "Playlist like removed";
      playListDoc.totalLikes.splice(userIndex, 1);
      userDoc.favPlaylists.splice(playlistIndex, 1);
    } else {
      messageResponse = "Playlist like added";
      playListDoc.totalLikes.push(userId);
      userDoc.favPlaylists.push(playlistId);
    }

    // Update the documents
    await playListDoc.save();
    await userDoc.save();

    return res.status(200).send({
      message: messageResponse,
      playlistId: playlistId,
      userId: userId,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}

async function addTrackToPlaylist(req, res) {
  console.log(" req.body", req.body);

  const { title, trackId } = req.body;
  let messageResponse = "Track already in playlist";
  try {
    //Collect playlist document
    const playlistDoc = await Playlists.findOne({ title: title });
    const trackContainedIndex = playlistDoc.tracks.indexOf(trackId);

    //Checking if index exists and if not, adding it to
    //the playlist and updating the playlist document
    if (trackContainedIndex === -1) {
      messageResponse = "Track added successfully";
      playlistDoc.tracks.push(trackId);
      playlistDoc.save();
    }
    return res.status(200).send({
      messageResponse: messageResponse,
      tracks: playlistDoc.tracks,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}

async function deleteTrackFromPlaylist(req, res) {
  const { playlistId } = req.params;
  const { trackId } = req.body;
  let messageResponse = "Track not found";
  try {
    //Collect playlist document and track to delete index
    const playlistDoc = await Playlists.findOne({ _id: playlistId });
    const trackIndexToDelete = playlistDoc.tracks.indexOf(trackId);

    //Checking if index exists, removing it from playlist and updating playlistDoc
    if (trackIndexToDelete >= 0) {
      messageResponse = "Track removed";
      playlistDoc.tracks.splice(trackIndexToDelete, 1);
      playlistDoc.save();
    }
    return res.status(200).send({
      message: messageResponse,
      trackId: trackId,
      playListId: playlistId,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}

//DELETE
async function deletePlaylistById(req, res) {
  const { id } = req.params;
  try {
    //Deleting existing playlist
    const { owner } = await Playlists.findByIdAndDelete(id);
    //Finding the user to update myPlaylists property and saving the document
    const userFound = await Users.findById(owner);
    const playlistToRemove = userFound.myPlaylists.indexOf(id);
    userFound.myPlaylists.splice(playlistToRemove, 1);
    await userFound.save();
    //Finding all user documents to update their favPlaylists property and saving them
    const users = await Users.find({});
    for (const user of users) {
      userFavPlaylistToRemove = user.favPlaylists.indexOf(id);
      if (userFavPlaylistToRemove >= 0) {
        user.favPlaylists.splice(userFavPlaylistToRemove, 1);
        await user.save();
      }
    }

    //Returning statuts after playlist delete and user document update
    return res.status(200).send({
      message: "Playlist deleted very successfully",
      data: {
        playlistId: id,
      },
    });
  } catch (error) {
    return res.status(500).send({
      data: req.params.id,
      error: error.message,
    });
  }
}

//GET
async function getAllPlaylists(req, res) {
  //Receive the limitation by req.body, by default 20
  const { limit = 20 } = req.body;
  try {
    const playlists = await Playlists.find({})
      .sort({ createdAt: -1 })
      .limit(limit);
    return res.status(200).send({
      playlistsSize: limit,
      playlists: playlists,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}

async function getPlaylistById(req, res) {
  const { id } = req.params;
  try {
    const foundPlaylist = await Playlists.findOne({
      _id: id,
    });
    return res.status(200).send({
      message: "Playlist found",
      currentPlaylist: foundPlaylist,
    });
  } catch (error) {
    return res.status(500).send({
      data: req.params.id,
      error: error.message,
    });
  }
}

async function getPlaylistByTitle(req, res) {
  const { title } = req.params;
  try {
    //Collect all tracks, turn title to
    //lowercase and initialize tracks to return
    const playlists = await Playlists.find({});
    const lwcPlaylistTitle = title.toLowerCase();
    let playlistsToReturn = [];

    //Check if title is contained inside tracks
    for (const playlist of playlists) {
      let playlistDocTitle = playlist.title.toLowerCase();
      if (playlistDocTitle.includes(lwcPlaylistTitle)) {
        playlistsToReturn.push(playlist);
      }
    }

    //Return tracks found
    return res.status(200).send({
      message: "Playlists found",
      playlists: playlistsToReturn,
    });
  } catch (error) {
    return res.status(500).send({
      data: title,
      error: error.message,
    });
  }
}

async function isLikedByUser(req, res) {
  const { id: playlistId } = req.params;
  const { userId } = req.body;

  try {
    const playlistDoc = await Playlists.findById(playlistId);
    const userInLikesArray = playlistDoc.totalLikes.indexOf(userId);

    if (userInLikesArray >= 0) {
      return res.status(200).send({
        message: `User: ${userId} likes playlist: ${playlistId}`,
        isLiked: true,
      });
    } else {
      return res.status(200).send({
        message: `User: ${userId} doesn't like playlist: ${playlistId}`,
        isLiked: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
}

async function getMostLiked(req, res) {
  //Receive the limitation by req.body, by default 20
  const { limit = 14 } = req.body;
  try {
    const playlists = await Playlists.find({})
      .sort({ totalLikes: -1 })
      .limit(limit);
    return res.status(200).send({
      playlistsSize: limit,
      playlists: playlists,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      error: error.message,
    });
  }
}

//exports
module.exports = {
  createPlaylist: createPlaylist,
  updatePlaylistById: updatePlaylistById,
  handlerPlaylistLike: handlerPlaylistLike,
  addTrackToPlaylist: addTrackToPlaylist,
  deleteTrackFromPlaylist: deleteTrackFromPlaylist,
  deletePlaylistById: deletePlaylistById,
  getAllPlaylists: getAllPlaylists,
  getPlaylistById: getPlaylistById,
  getPlaylistByTitle: getPlaylistByTitle,
  isLikedByUser: isLikedByUser,
  getMostLiked: getMostLiked,
};
