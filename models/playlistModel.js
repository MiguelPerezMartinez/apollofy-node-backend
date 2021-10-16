const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PlaylistSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title to the playlist"],
      trim: true,
      maxLength: [20, "Playlist title cannot exceed 20 characters"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [30, "Playlist description cannot exceed 30 characters"],
    },
    tracks: {
      type: [{ type: Schema.Types.ObjectId, ref: "tracks" }],
      default: [],
    },
    genre: {
      type: String,
      // required: [true, "Please select genre for this playlist"],
      enum: [
        "Country",
        "Electronic dance music (EDM)",
        "Hip-hop",
        "Indie rock",
        "Jazz",
        "K-pop",
        "Metal",
        "Oldies",
        "Pop",
        "Rap",
        "Rhythm & blues (R&B)",
        "Rock",
        "Techno",
        "Folk",
        "Ska",
        "Reggae",
        "Punk",
      ],
      message: "Please select a genre for the playlist",
    },
    private: {
      type: Boolean,
      required: [true, " Input playlist privacy mode"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "Please input an owner"],
      ref: "users",
    },
    playlistImage: {
      type: String,
      default: "",
    },
    totalLikes: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true },
);

const Playlists = mongoose.model("playlists", PlaylistSchema);

module.exports = Playlists;
