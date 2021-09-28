// imports
const app = require("./server");
const { config } = require("./config");
const db = require("./models");
const {connect} = require("./db");

// connection and connection test
connect().then(async function seed(){
  console.log("connection success");
  const isExist = await db.userModel.find({});
  if(isExist.length!=0){
    console.log("some user exist")
  }else{
    const { _id } = await db.userModel.create({
      active:true,
      role:"admin",
      username:"admin",
      email:"admin@admin.com",
      firstName:"adminName",
      lastName:"adminLastName",
      country:"admiLandia",
      birthday:"1999-12-30",
      mySongs:[],
      favSongs:[],
      myPlaylists:[],
      favPlaylists:[],
      lastSongs:[],
      friends:[],

    });
  }
});

// port conenction test
app.listen(config.app.PORT, () =>
  console.log("server running on port " + config.app.PORT),
);
