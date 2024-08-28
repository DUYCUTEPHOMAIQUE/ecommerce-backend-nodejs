"use strict";

const { BadRequestError } = require("../core/error.response");
const { findByCartId } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  /**
     {
        cartId, => check 
        userId, => check
        shop_order_ids: [ => 1gio hang co nhieu shop
            {
                shopId,
                shop_discounts: [],
                item_products: [ => moi shop co nhieu san pham
                    {
                        price, => check
                        quantity,
                        productId
                    },
                    {
                        price, => check
                        quantity,
                        productId
                    }
                ]
            },
            {
                shopId,
                shop_discounts: [
                        {
                            "shopId",
                            "discountId"
                            "codeId"
                        }
                    ],
                item_products: [ => moi shop co nhieu san pham
                    {
                        price, => check
                        quantity,
                        productId
                    },
                    {
                        price, => check
                        quantity,
                        productId
                    }
                ]
            }
        ]
     }
     */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findByCartId(cartId);
    if (!foundCart) throw new BadRequestError("ko thay cart");

    const checkout_order = {
        total_price: 0,
        fee_ship: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    //tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);
      //neu co gia tri undefined
      if (!checkProductServer[0]) throw new BadRequestError("san pham loi");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      //tong tien trc khi xu li
      checkout_order.total_price = +checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        //check coi discount co ton tai k
        //gia su co 1 discount
        //get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId: userId,
          shopId: shopId,
          products: checkProductServer,
        });

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = itemCheckout.priceRaw - discount;
          //dua ra ben ngoai
          checkout_order.totalDiscount += discount;
        }
      }

      //tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(item_products);
    }

    return {
      checkout_order,
      shop_order_ids_new,
      shop_order_ids,
    };
  }
}

module.exports = CheckoutService;
