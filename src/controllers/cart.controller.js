const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "add To Cart",
      metadata: await CartService.addToCart({
        ...req.body,
      }),
    }).send(res);
  };
  update = async (req, res, next) => {
    new SuccessResponse({
      message: "add To Cart",
      metadata: await CartService.addToCartV2({
        ...req.body,
      }),
    }).send(res);
  };
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "add To Cart",
      metadata: await CartService.deleteItemInCart({
        ...req.body,
      }),
    }).send(res);
  };
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "add To Cart",
      metadata: await CartService.getListUserCart({
        userId: req.query.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
