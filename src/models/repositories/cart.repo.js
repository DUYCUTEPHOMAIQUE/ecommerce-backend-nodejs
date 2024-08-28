"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const { cart } = require("../cart.model");

const findByCartId = async (id) => {
  return await cart.findOne({
    _id: convertToObjectIdMongodb(id),
    cart_state: "active",
  });
};

module.exports = {
  findByCartId,
};
