"use strict";
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const { NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
/**
 *
 *  add product to cart [user]
 *  reduce product quantity by one [user]
 *  increase product quantity by one [user]
 *  get cart [user]
 * delete cart [user]
 * delete cart item [user]
 */

class CartService {
  // REPO CART //

  static async createUserCart({ userId, product }) {
    const foundProduct = await getProductById(product?.productId);
    if (!foundProduct) {
      throw new NotFoundError("ko tim thay san pham nay");
    }
    const { product_name, product_price } = foundProduct;
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: { ...product, product_name, product_price }, //check va cap nhat price & name
        },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateOrInsert = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  // END REPO CART //

  static async addToCart({ userId, product = {} }) {
    const foundProduct = await getProductById(product?.productId);
    if (!foundProduct) {
      throw new NotFoundError("ko tim thay san pham nay");
    }
    const { product_name, product_price } = foundProduct;
    const userCart = await cart.findOne({
      cart_userId: userId,
    });

    if (!userCart) {
      //create cart
      return await CartService.createUserCart({ userId, product });
    }

    //neu co cart nhung chua co sp
    if (!userCart.cart_products.length) {
      userCart.cart_products = [{ ...product, product_name, product_price }];
      return await userCart.save();
    }

    //cart chua co sp nay

    const foundProductInCart = await cart.findOne({
      cart_userId: userId,
      "cart_products.productId": product.productId,
    });
    if (!foundProductInCart) {
      return cart.findOneAndUpdate(
        {
          cart_userId: userId,
        },
        {
          $push: {
            cart_products: { ...product, product_name, product_price },
          },
        },
        { upsert: true, new: true }
      );
    }

    //gio hang ton tai, va co san pham nay thi update

    return await CartService.updateUserCartQuantity({
      userId,
      product: { ...product, product_name, product_price },
    });
  }

  //update
  /**
   * 
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId
          }
        ],
        version
      }
    ]
   */

  static async addToCartV2({ userId, shop_order_ids = [] }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    //check product ton tai hay k
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("k thay san pham de update");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("k thay shop cua san pham");
    }

    if (quantity === 0) {
      //deleted
    }

    return await CartService.updateUserCartQuantity({
      userId: userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteItemInCart({ userId, productId }) {
    console.log({ userId, productId });
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
