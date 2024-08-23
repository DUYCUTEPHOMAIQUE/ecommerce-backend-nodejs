"use strict";

const express = require("express");
const router = express.Router();
const DiscountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

router.post("/", asyncHandler(DiscountController.createDiscountCode));

module.exports = router;
