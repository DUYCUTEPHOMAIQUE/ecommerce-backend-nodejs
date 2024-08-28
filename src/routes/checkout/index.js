const express = require("express");
const router = express.Router();
const checkoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

router.post("", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
