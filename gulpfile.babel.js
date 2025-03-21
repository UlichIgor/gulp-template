"use strict";
import { watch, series, parallel } from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import { Clean } from "./gulp/dev/Clean.js";
import { CleanBuild } from "./gulp/prod/CleanBuild.js";
import { Resources } from "./gulp/dev/Resources.js";
import { ResourcesBuild } from "./gulp/prod/ResourcesBuild.js";
import { Sprite } from "./gulp/dev/Sprite.js";
import { SpriteBuild } from "./gulp/prod/SpriteBuild.js";
import { Styles } from "./gulp/dev/Styles.js";
import { StylesBuild } from "./gulp/prod/StylesBuild.js";
import { Scripts } from "./gulp/dev/Scripts.js";
import { ScriptsBuild } from "./gulp/prod/ScriptsBuild.js";
import { Html } from "./gulp/dev/Html.js";
import { HtmlBuild } from "./gulp/prod/HtmlBuild.js";
import { Browsersync } from "./gulp/dev/Browsersync.js";
import { BrowsersyncBuild } from "./gulp/prod/BrowsersyncBuild.js";
import config from "./paths.js";
import { WebpImages } from "./gulp/dev/WebpImages.js";
import { WebpImagesBuild } from "./gulp/prod/WebpImagesBuild.js";
import { FontsWoff2 } from "./gulp/dev/FontsWoff2.js";
import { FontsWoff2Build } from "./gulp/prod/FontsWoff2Build.js";
export const sass = gulpSass(dartSass);
export const uglify = require("gulp-uglify-es").default;
export const htmlmin = require("gulp-htmlmin");
export var browserSync = require("browser-sync").create();
export var reload = browserSync.reload;
const fs = require('fs');

exports.FontsWoff2 = FontsWoff2;
exports.FontsWoff2Build = FontsWoff2Build;
exports.WebpImages = WebpImages;
exports.WebpImagesBuild = WebpImagesBuild;
exports.Clean = Clean;
exports.CleanBuild = CleanBuild;
exports.Sprite = Sprite;
exports.SpriteBuild = SpriteBuild;
exports.Resources = Resources;
exports.ResourcesBuild = ResourcesBuild;
exports.Styles = Styles;
exports.StylesBuild = StylesBuild;
exports.Scripts = Scripts;
exports.ScriptsBuild = ScriptsBuild;
exports.Html = Html;
exports.HtmlBuild = HtmlBuild;
exports.watch = watch;
exports.Browsersync = Browsersync;
exports.BrowsersyncBuild = BrowsersyncBuild;
exports.production = production;
exports.development = development;
function production(cb) {
  const production = series(
    CleanBuild,
    parallel(FontsWoff2Build),
    parallel(WebpImagesBuild),
    parallel(ResourcesBuild),
    parallel(ScriptsBuild),
    parallel(StylesBuild),
    parallel(SpriteBuild),
    parallel(HtmlBuild),
    parallel(BrowsersyncBuild)
  );
  production(cb);
}
function development(cb) {
  const development = series(
    Clean,
    parallel(FontsWoff2),
    parallel(WebpImages),
    parallel(Resources),
    parallel(Styles),
    parallel(Scripts),
    parallel(Sprite),
    parallel(Html),
    parallel(Browsersync)
  );
  development(cb);
  cb();
}
