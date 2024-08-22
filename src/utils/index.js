"use strict";

const { response } = require("express");
const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};
//['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
//['a', 'b'] => {a: 0, b: 0}

const unGetSelect = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};
const updateNestedObjectParser = (obj) => {
  console.log(`[1]::`, obj);
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (
      typeof obj[k] === "object" &&
      !Array.isArray(obj[k]) &&
      obj[k] !== null
    ) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        if (response[a]) final[`${k}.${a}`] = response[a];
      });
    } else {
      if (obj[k]) final[k] = obj[k];
    }
  });
  console.log(`[2]::`, final);

  return final;
};

/**
 const updateNestedObject = ({ target, updateFields }) => {
  for (let key in target) {
    if (_.isPlainObject(target[key])) {
      // plain object is object which is created from Object or {}
      target[key] = updateNestedObject({ target: target[key], updateFields: updateFields[key] })
    } else if (key in updateFields) {
      target[key] = updateFields[key]
    }
  }
  return target
}
 */
module.exports = {
  getInfoData,
  getSelectData,
  unGetSelect,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
