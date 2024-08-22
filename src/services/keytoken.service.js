"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({
      refreshToken: refreshToken,
    });
  };
  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({
      user: new Types.ObjectId(userId),
    });
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({
        resfreshTokensUsed: refreshToken,
      })
      .lean();
  };
  static removeKeyById = async (id) => {
    return await keytokenModel.findOneAndDelete({
      _id: id,
    });
  };
  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({
      user: new Types.ObjectId(userId),
    });
  };
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken = null,
  }) => {
    try {
      //lv 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      //lv max
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
