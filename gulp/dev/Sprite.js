"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const svgSprite = require("gulp-svg-sprite");

function Sprite() {
  return src(config.sprite.src, { allowEmpty: true })
    .pipe(svgSprite({
      shape: { spacing: { padding: 5 } },
      mode: {
        css: {
          dest: ".",
          layout: "diagonal",
          sprite: "./sprite.svg",
          bust: false,
          prefix: ".%s",
          render: {
            css: { dest: "./sprite.css" },
            scss: { dest: "../../src/scss/_sprite.scss" }
          }
        }
      }
    }))
    .pipe(dest(config.sprite.dest));
}
module.exports = { Sprite };
