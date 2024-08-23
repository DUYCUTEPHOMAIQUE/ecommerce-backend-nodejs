"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  createDiscountCode,
  deleteDiscount,
  cancelDiscount,
  getAllDiscountCodesWithProduct,
  getAllDiscountCodeByShop,
  getDiscountAmount,
} = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "create discount code success!",
      metadata: await createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "create discount code success!",
      metadata: await getAllDiscountCodesWithProduct(req.body),
    }).send(res);
  };
  getAllDiscountCodeByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "create discount code success!",
      metadata: await getAllDiscountCodeByShop(req.body),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "create discount code success!",
      metadata: await getDiscountAmount(req.body),
    }).send(res);
  };
  cancelDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "create discount code success!",
      metadata: await cancelDiscount(req.body),
    }).send(res);
  };

  deleteDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "create discount code success!",
      metadata: await deleteDiscount(req.params),
    }).send(res);
  };
}

module.exports = new DiscountController();
