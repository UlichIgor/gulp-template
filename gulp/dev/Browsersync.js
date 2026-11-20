"use strict";
const { watch, series } = require("gulp");
const config = require("../../paths.js");
const { Styles } = require("./Styles.js");
const { Scripts } = require("./Scripts.js");
const { Html } = require("./Html.js");
const browserSync = require("browser-sync").create();

function Browsersync(done) {
  const reload = (callback) => {
    browserSync.reload();
    callback();
  };

  browserSync.init({
    notify: false,
    open: true,
    server: { baseDir: config.server }
  }, (error) => {
    if (error) return done(error);
    watch(config.styles.watch, series(Styles, reload));
    watch(config.scripts.watch, series(Scripts, reload));
    watch(config.html.watch, series(Html, reload));
    done();
  });
}
module.exports = { Browsersync };
