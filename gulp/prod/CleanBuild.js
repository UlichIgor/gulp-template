"use strict";
const { rimraf } = require("rimraf");

function CleanBuild() {
  return rimraf("dist");
}
module.exports = { CleanBuild };
