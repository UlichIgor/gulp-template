"use strict";

const config = {
  server: "./assets",
  serverBuild: "./dist",
  styles: {
    src: "./src/scss/*.scss",
    dest: "./assets/css",
    watch: "./src/scss/**/*.scss",
    dist: "./dist/css"
  },
  scripts: {
    src: "./src/js/**/*.js",
    dest: "./assets/js",
    watch: "./src/js/**/*.js",
    dist: "./dist/js"
  },
  html: {
    src: "./src/*.html",
    dest: "./assets",
    watch: "./src/**/*.html",
    dist: "./dist"
  },
  resources: {
    src: "./src/resources/**/*",
    dest: "./assets",
    prod: "./dist"
  },
  images: {
    src: "./src/images/*.{jpg,jpeg,png}",
    dest: "./assets/images",
    watch: "./src/images/*.{jpg,jpeg,png}",
    dist: "./dist/images"
  },
  sprite: {
    src: "./src/images/svg/*.svg",
    dest: "./assets/css",
    watch: "./src/images/svg/*.svg",
    dist: "./dist/css"
  },
  fonts: {
    src: ["./src/fonts/*.ttf"],
    dest: "./assets/fonts",
    watch: "./src/fonts/*.ttf",
    dist: "./dist/fonts"
  }
};

module.exports = config;
