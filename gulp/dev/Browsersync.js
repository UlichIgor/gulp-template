"use strict";
const { watch } = require("gulp");
const config = require("../../paths.js");
const { Styles } = require("./Styles.js");
const { Scripts } = require("./Scripts.js");
const { Html } = require("./Html.js");
const browserSync = require("browser-sync").create();

function Browsersync(done) {
  browserSync.init({
    notify: false,
    open: true,
    server: { baseDir: config.server }
  }, (error) => {
    if (error) return done(error);
    watch(config.styles.watch, Styles).on("change", browserSync.reload);
    watch(config.scripts.watch, Scripts).on("change", browserSync.reload);
    watch(config.html.watch, Html).on("change", browserSync.reload);
    done();
  });
}
module.exports = { Browsersync };
