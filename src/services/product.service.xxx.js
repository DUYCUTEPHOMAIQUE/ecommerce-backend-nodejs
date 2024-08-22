"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { components } = require("./product.config");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsProduct,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");

class ProductFactory {
  /*
        type: 'Clothing
    */
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type:: ${type}`);
    return new productClass(payload).createProduct();
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type:: ${type}`);
    return new productClass(payload).updateProduct(productId);
  }

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  //END PUT //

  // QUERY //
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftsProduct({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };

    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
    select = ["product_description"], //option for fe
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb", ...select],
    });
  }
  static async findProduct({ product_id, unSelect = [] }) {
    console.log(unSelect);
    return await findProduct({ product_id, unSelect: ["__v", ...unSelect] });
  }

  // END QUERY //
}
//define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    });
    if (newProduct) {
      //add inventory
      await insertInventory({
        productId: product_id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  //Update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId: productId,
      bodyUpdate: bodyUpdate,
      isNew: true,
      model: product,
    });
  }
}

//define sub product for different product types Clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("create new Clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }

  async updateProduct(productId) {
    /**
     1. remove attr null or undefined
     3. check update cho nao
     */
    const objectParams = removeUndefinedObject(this);
    console.log(`this:: ${this.product_attributes.size}`);
    console.log(`this:: ${objectParams.product_attributes}`);
    if (objectParams.product_attributes) {
      //update child
      console.log(`update child`);
      await updateProductById({
        productId: productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        isNew: true,
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
//define sub product for different product types Electronics

class Electronics extends Product {
  async createProduct() {
    console.log(`creating===`);
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    console.log(`creating===`);
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new Furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = {
  ProductServiceV2: ProductFactory,
};
