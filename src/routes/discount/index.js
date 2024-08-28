"use strict";

const express = require("express");
const router = express.Router();
const DiscountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

router.get("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/list_products_code",
  asyncHandler(DiscountController.getAllDiscountCodesWithProduct)
);

// authentication //
router.use(authenticationV2);

router.post("/create", asyncHandler(DiscountController.createDiscountCode));
router.get(
  "/get_all_discounts_code_by_shop",
  asyncHandler(DiscountController.getAllDiscountCodeByShop)
);

module.exports = router;
