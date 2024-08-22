"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keytoken.service");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify:: `, err);
      } else {
        console.log(`decode verify:: `, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

// const authentication = asyncHandler(async (req, res, next) => {
//   /*
//   1. check userId missing??
//   2. get accessToken
//   3. verify token
//   4. check user in db
//   5. check keyStore with this userId
//   6. OK => return next
//   */

//   const userId = req.headers[HEADER.CLIENT_ID];
//   if (!userId) {
//     throw new AuthFailureError("Invalid request!");
//   }

//   const keyStore = await findByUserId(userId);
//   if (!keyStore) {
//     throw new NotFoundError("Not found key Store!");
//   }
//   //get accesstoken
//   const accessToken = req.headers[HEADER.AUTHORIZATION];
//   if (!accessToken) {
//     throw new AuthFailureError("Invalid request!");
//   }
//   try {
//     const decodeUser = JWT.verify(accessToken, keyStore.publicKey); // {userId, email}
//     if (userId != decodeUser.userId)
//       throw new AuthFailureError("Invalid UserId");
//     //gan keyStore len req de logout
//     req.keyStore = keyStore;
//     req.user = decodeUser // {userId, email}
//     return next();
//   } catch (error) {
//     throw error;
//   }
// });

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request!");
  }

  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found key Store!");
  }
  //get accesstoken
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey); // {userId, email}
      if (userId != decodeUser.userId)
        throw new AuthFailureError("Invalid UserId");
      //gan keyStore len req de logout
      req.keyStore = keyStore;
      req.user = decodeUser; // {userId, email}
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  console.log(`no hav refreshToken`);
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request!");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey); // {userId, email}
    if (userId != decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");
    //gan keyStore len req de logout
    req.keyStore = keyStore;
    req.user = decodeUser; // {userId, email}
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  console.log({
    token,
    keySecret,
  });
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authenticationV2,
  verifyJWT,
};
