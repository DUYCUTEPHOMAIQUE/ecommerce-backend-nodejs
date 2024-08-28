"use strict";

const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

router.post("", asyncHandler(CartController.addToCart));
router.post("/update", asyncHandler(CartController.update));
router.delete("", asyncHandler(CartController.delete));
router.get("", asyncHandler(CartController.listToCart));

// authentication //
router.use(authenticationV2);

module.exports = router;
