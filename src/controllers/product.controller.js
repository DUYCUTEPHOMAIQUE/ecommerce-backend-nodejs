"use strict";

const { ProductService } = require("../services/product.service");
const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const { ProductServiceV2 } = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Create Successful!",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     ...req.user,
    //   }),
    // }).send(res);

    //V2
    new SuccessResponse({
      message: "Create Successful!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        ...req.user,
      }),
    }).send(res);
  };

  // update product //
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "update product success!",
      metadata: await ProductServiceV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          ...req.user,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "publishProductByShop Successful!",
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "publishProductByShop Successful!",
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @description Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list getAllDraftsForShop Successful!",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list getAllPublishedForShop Successful!",
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search Successful!",
      metadata: await ProductServiceV2.searchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findAllProducts Successful!",
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  };
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findProduct Successful!",
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id,
        unSelect: ["createdAt", "updatedAt", "_id"],
      }),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
