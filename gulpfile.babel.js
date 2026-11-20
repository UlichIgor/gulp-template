"use strict";

import { series, parallel } from "gulp";
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
import { WebpImages } from "./gulp/dev/WebpImages.js";
import { WebpImagesBuild } from "./gulp/prod/WebpImagesBuild.js";
import { FontsWoff2 } from "./gulp/dev/FontsWoff2.js";
import { FontsWoff2Build } from "./gulp/prod/FontsWoff2Build.js";
import { CourseBuild } from "./gulp/prod/CourseBuild.js";

exports.Clean = Clean;
exports.CleanBuild = CleanBuild;
exports.Resources = Resources;
exports.ResourcesBuild = ResourcesBuild;
exports.Sprite = Sprite;
exports.SpriteBuild = SpriteBuild;
exports.Styles = Styles;
exports.StylesBuild = StylesBuild;
exports.Scripts = Scripts;
exports.ScriptsBuild = ScriptsBuild;
exports.Html = Html;
exports.HtmlBuild = HtmlBuild;
exports.Browsersync = Browsersync;
exports.WebpImages = WebpImages;
exports.WebpImagesBuild = WebpImagesBuild;
exports.FontsWoff2 = FontsWoff2;
exports.FontsWoff2Build = FontsWoff2Build;

// Generate the sprite before SCSS compilation because it writes _sprite.scss.
const developmentBuild = series(
  Clean,
  parallel(FontsWoff2, WebpImages, Resources),
  Sprite,
  parallel(Styles, Scripts, Html)
);

const productionBuild = series(
  CleanBuild,
  parallel(FontsWoff2Build, WebpImagesBuild, ResourcesBuild),
  SpriteBuild,
  parallel(StylesBuild, ScriptsBuild, HtmlBuild),
  CourseBuild
);

// BrowserSync is intentionally limited to development. A production build must
// finish and exit so CI and the deploy command can continue.
exports.development = series(developmentBuild, Browsersync);
exports.production = productionBuild;
