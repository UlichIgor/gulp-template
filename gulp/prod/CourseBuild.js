"use strict";
const { src, dest } = require("gulp");

// Додає статичний інтерактивний курс до production-сайту.
// Курс не змінює основний сайт і доступний за адресою /course/.
function CourseBuild() {
  return src("./course/**/*", { allowEmpty: false })
    .pipe(dest("./dist/course"));
}

module.exports = { CourseBuild };
