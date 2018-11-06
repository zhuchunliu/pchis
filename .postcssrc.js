// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "autoprefixer": {
      "browsers": [
        "> 1%",
        "iOS >= 7",
        "Android > 4",
        "Firefox >= 10",
        "ie >= 8"
      ]
    }
  }
}
