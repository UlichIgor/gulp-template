"use strict";
const { rimraf } = require("rimraf");

function Clean() {
  return rimraf("assets");
}
module.exports = { Clean };
