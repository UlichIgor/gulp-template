"use strict";
const { src, dest } = require("gulp");
const { pipeline } = require("stream/promises");

function CourseBuild() {
  const copyToRoot = pipeline(
    src("./course/**/*", { allowEmpty: false }),
    dest("./dist")
  );
  const copyToCourseFolder = pipeline(
    src("./course/**/*", { allowEmpty: false }),
    dest("./dist/course")
  );
  return Promise.all([copyToRoot, copyToCourseFolder]);
}

module.exports = { CourseBuild };
