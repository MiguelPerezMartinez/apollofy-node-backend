const { userModel } = require("../models");

async function register(req, res) {
  const { email, ...reqBody } = req.body;
  console.log(reqBody);
  console.log(email);
  //   const { uid, username, email } = req.body;
  try {
    const foundUser = await userModel.findOne({
      email: email,
    });
    if (!foundUser) {
      const { _id } = await userModel.create({
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

async function getById(req, res) {
  const { id: firebase_id } = req.params;
  try {
    const foundUser = await userModel.findOne({
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

// async function updateUser(req, res, next) {
//   console.log(req.body)
//   try {
//     var { pass, ...bodyReq } = req.body;
//     if (pass) {
//       pass = await encryptString(pass);
//       bodyReq = { ...bodyReq, pass };
//     }
//     const dbResponse = await db.Users.findByIdAndUpdate(
//       req.params.id,
//       bodyReq,
//       {
//         new: true,
//       },
//     );

//     if (!dbResponse) {
//       res.status(400).send(
//         generateResponse({
//           data: null,
//           error: "User ID doesn't exist",
//         }),
//       );
//     }

//     res.status(200).send(
//       generateResponse({
//         data: dbResponse,
//       }),
//     );
//   } catch (error) {
//     res.status(500).send(
//       generateResponse({
//         data: req.params.id,
//         error: error,
//       }),
//     );

//     next(error);
//   }
// }
async function updateById(req, res) {
  const { id } = req.params;
  console.log("body request ->", req.body);
  const bodyReq = req.body;
  try {
    console.log("id => ", id);
    console.log("bodyReq => ", bodyReq);
    const dbResponse = await userModel.findByIdAndUpdate(id, bodyReq, {
      new: true,
    });

    if (!dbResponse) {
      res.status(400).send(
        generateResponse({
          data: null,
          error: "User ID doesn't exist",
        }),
      );
    }

    res.status(200).send({
      data: dbResponse,
    });
  } catch (error) {
    res.status(500).send({
      data: req.params.id,
      error: error.message,
    });
  }
}

module.exports = {
  register: register,
  getById: getById,
  updateProfile: updateById,
};
