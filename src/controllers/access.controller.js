"use strict";

const AccessService = require("../services/access.service");
const { CREATED, OK, SuccessResponse } = require("../core/success.response");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Get token successfull!!",
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res);
    //v2 no need accessToken

    new SuccessResponse({
      message: "Get token successfull!!",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Successfully!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
        //say something TT
      },
    }).send(res);
  };
}

module.exports = new AccessController();
