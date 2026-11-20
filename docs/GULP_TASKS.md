# Документація задач Gulp

Цей документ пояснює, що робить кожен модуль у `gulp/dev/`, як він працює, які файли читає та створює, як налаштовується і як перевірити результат. Опис відповідає поточній реалізації репозиторію.

> Важливо: задачі з каталогу `gulp/dev/` призначені для локальної розробки. Production-версії мають суфікс `Build` і можуть мати інші параметри оптимізації. Не слід автоматично переносити налаштування з одного режиму в інший.

## 1. Загальна схема Gulp

Gulp — це інструмент автоматизації, який запускає функції-задачі. Задача зазвичай читає вихідні файли, обробляє їх через потік плагінів і записує результат у каталог збірки.

У цьому проєкті:

- `src/` — вихідний код, який редагує розробник;
- `gulp/dev/` — задачі локальної розробки;
- `gulp/prod/` — задачі production-збірки;
- `paths.js` — централізовані шляхи до вхідних файлів, результатів і файлів для спостереження;
- `assets/` — результат локальної збірки;
- `dist/` — готовий сайт для публікації.

Типовий ланцюжок задач розробки описаний у `gulpfile.babel.js`:

```js
const developmentBuild = series(
  Clean,
  parallel(FontsWoff2, WebpImages, Resources),
  Sprite,
  parallel(Styles, Scripts, Html)
);

exports.development = series(developmentBuild, Browsersync);
```

`series()` запускає задачі послідовно, а `parallel()` — паралельно. Спрайт створюється до компіляції SCSS, оскільки він генерує файл `_sprite.scss`, який можуть підключати стилі.

## 2. Browsersync.js — локальний сервер і автоматичне оновлення браузера

**Призначення:** запускати сайт локально та автоматично перезавантажувати браузер після перебудови HTML, SCSS або JavaScript.

**Файл:** `gulp/dev/Browsersync.js`

### Як працює

1. Створює екземпляр BrowserSync через `browserSync.create()`.
2. Запускає локальний сервер із кореневою папкою `config.server` (у поточному `paths.js` це `./assets`).
3. Вимикає службове повідомлення BrowserSync параметром `notify: false`.
4. Відкриває браузер автоматично завдяки `open: true`.
5. Стежить за трьома групами файлів:
   - `config.styles.watch` — SCSS;
   - `config.scripts.watch` — JavaScript;
   - `config.html.watch` — HTML.
6. Коли файл змінюється, спочатку запускає відповідну задачу збірки, а потім викликає `browserSync.reload()`.

### Важливі фрагменти

```js
browserSync.init({
  notify: false,
  open: true,
  server: { baseDir: config.server }
});
```

Цей код означає: показувати в браузері файли з `assets/`, не показувати повідомлення BrowserSync і відкрити сторінку після старту сервера.

```js
watch(config.styles.watch, series(Styles, reload));
```

Спочатку перебудовуються стилі, і лише після завершення збірки браузер перезавантажується. Такий самий принцип використовується для скриптів і HTML.

### Запуск

```bash
npm run dev
```

Команда запускає всю задачу `development`, а в кінці — BrowserSync. Зупинка сервера: `Ctrl + C` у терміналі.

### Нюанс поточної конфігурації

BrowserSync зараз стежить лише за SCSS, JavaScript та HTML. Зміни у зображеннях, шрифтах, SVG-іконках і ресурсах не запускають перебудову автоматично. Якщо потрібно, щоб вони також оновлювалися без ручного перезапуску, додайте окремі `watch()` для відповідних шляхів і задач.

**Типові проблеми:** сервер показує стару версію — перевірте, чи задача збірки завершується без помилки; порожня сторінка — перевірте `config.server` та наявність `assets/index.html`; порт зайнятий — закрийте інший процес BrowserSync або налаштуйте порт.

## 3. Clean.js — очищення результатів розробки

**Призначення:** видалити стару папку `assets/` перед новою збіркою, щоб у результаті не залишалися файли від попередніх запусків.

**Файл:** `gulp/dev/Clean.js`

```js
const { rimraf } = require("rimraf");

function Clean() {
  return rimraf("assets");
}
```

### Як працює

- `rimraf` рекурсивно видаляє каталог і його вміст.
- Функція повертає Promise, який Gulp очікує перед запуском наступної задачі.
- У `gulpfile.babel.js` задача стоїть першою в `series()`, тому обробка починається тільки після завершення очищення.

### Приклад

```bash
npm run dev
```

На початку запуску папка `assets/` видаляється, а потім генерується заново.

### Обережно

Не змінюйте шлях на `src` або іншу папку з вихідним кодом: це призведе до видалення файлів розробника. Якщо змінюєте каталог збірки, узгодьте його з `paths.js` і командами очищення.

## 4. FontsWoff2.js — конвертація шрифтів TTF у WOFF2

**Призначення:** перетворювати вихідні шрифти формату TTF на WOFF2, який зазвичай займає менше місця та швидше завантажується в браузері.

**Файл:** `gulp/dev/FontsWoff2.js`

```js
function FontsWoff2() {
  return src(config.fonts.src, { encoding: false, allowEmpty: true })
    .pipe(ttf2woff2())
    .pipe(dest(config.fonts.dest));
}
```

### Вхідні та вихідні файли

- Джерело: `src/fonts/*.ttf`.
- Результат: `assets/fonts/`.
- Формат результату: `.woff2`.

### Пояснення кроків

1. `src(...)` знаходить TTF-файли за шаблоном у `paths.js`.
2. `encoding: false` читає дані як бінарні, а не як текст.
3. `allowEmpty: true` дозволяє задачі завершитися, якщо шрифти ще не додані.
4. `ttf2woff2()` виконує конвертацію.
5. `dest()` записує результат у папку шрифтів.

### Приклад підключення у SCSS

```scss
@font-face {
  font-family: "MyFont";
  src: url("../fonts/my-font.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Назву файлу та шлях у прикладі замініть на фактичні. Перевірте, що відносний шлях відповідає розташуванню згенерованого CSS.

**Типові проблеми:** шрифт не відображається — перевірте ім'я файлу, шлях, вагу `font-weight` і вкладку Network у DevTools; файл не створився — переконайтеся, що TTF лежить безпосередньо у `src/fonts/`.

## 5. Html.js — збирання HTML-сторінок і включення фрагментів

**Призначення:** формувати HTML-сторінку з основного шаблону та повторно використовуваних фрагментів, перевіряти BEM-іменування класів і записувати результат у `assets/`.

**Файл:** `gulp/dev/Html.js`

```js
function Html() {
  return src(config.html.src)
    .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
    .pipe(rename({ basename: "index" }))
    .pipe(gulpHtmlBemValidator())
    .pipe(dest(config.html.dest));
}
```

### Етапи обробки

1. Читає HTML-файли з `src/*.html`.
2. `gulp-file-include` підставляє вміст підключених HTML-фрагментів.
3. Префікс `@@` задає синтаксис директив включення.
4. `basepath: "@file"` означає, що шлях до фрагмента рахується відносно файлу, у якому написана директива.
5. `rename()` задає базове ім'я вихідного файлу `index`.
6. `gulp-html-bem-validator()` перевіряє відповідність класів правилам BEM.
7. `dest()` записує результат до `assets/`.

### Приклад структури

```text
src/
  index.html
  html/
    head.html
    header.html
    footer.html
```

У головному шаблоні можна використати:

```html
<!doctype html>
<html lang="uk">
  @@include("./html/head.html")
  <body>
    @@include("./html/header.html")
    <main class="page">
      <h1 class="page__title">Моя сторінка</h1>
    </main>
    @@include("./html/footer.html")
  </body>
</html>
```

Після обробки директиви `@@include` замінюються реальним HTML-кодом фрагментів.

### Правило BEM

BEM допомагає будувати передбачувані назви CSS-класів:

- блок: `card`;
- елемент блоку: `card__title`;
- модифікатор: `card--featured` або `card__title--large`.

Приклад:

```html
<article class="card card--featured">
  <h2 class="card__title">Заголовок</h2>
</article>
```

**Зверніть увагу:** `rename({ basename: "index" })` призначає базове ім'я `index` кожному файлу, який потрапив у потік. Поточна конфігурація очікує один основний HTML-файл у `src/*.html`. Якщо сторінок буде декілька, налаштуйте окрему обробку або збереження оригінальних назв, щоб не отримати конфлікт імен.

## 6. Resources.js — копіювання статичних ресурсів

**Призначення:** переносити файли, які не потребують компіляції чи конвертації, з `src/resources/` до каталогу збірки.

**Файл:** `gulp/dev/Resources.js`

```js
function Resources() {
  return src(config.resources.src, { allowEmpty: true })
    .pipe(dest(config.resources.dest));
}
```

### Що може належати до ресурсів

Наприклад: favicon, файли верифікації домену, robots.txt, manifest, PDF-документи та інші статичні файли. Фактичний вміст залежить від того, що ви зберігаєте в `src/resources/`.

### Як працює

- `config.resources.src` відповідає шаблону `src/resources/**/*` і знаходить файли також у вкладених папках.
- `allowEmpty: true` дозволяє відсутність ресурсів.
- `dest(config.resources.dest)` копіює їх до `assets/`, зберігаючи відносну структуру.

### Приклад

Якщо є файл `src/resources/favicon.ico`, після задачі він опиниться за адресою `assets/favicon.ico`. Файл `src/resources/docs/guide.pdf` буде скопійований у `assets/docs/guide.pdf`.

**Важливо:** задача не оптимізує і не змінює вміст файлів — вона лише копіює їх.

## 7. Scripts.js — збирання JavaScript через Webpack і Babel

**Призначення:** об'єднувати JavaScript-модулі, обробляти сучасний синтаксис через Babel, створювати source map і записувати один файл скриптів.

**Файл:** `gulp/dev/Scripts.js`

### Ланцюжок обробки

```js
return src(config.scripts.src)
  .pipe(webpackStream({
    mode: "development",
    output: { filename: "main.js" },
    module: {
      rules: [{
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] }
        }
      }]
    }
  }))
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(rename({ basename: "scripts", suffix: ".min", extname: ".js" }))
  .pipe(sourcemaps.write("."))
  .pipe(dest(config.scripts.dest));
```

1. `src(config.scripts.src)` знаходить JS-файли в `src/js/`.
2. `webpackStream()` передає потік до Webpack.
3. Webpack створює вихідний bundle з назвою `main.js`.
4. `babel-loader` обробляє JavaScript-файли, що відповідають регулярному виразу `/\.m?js$/`, крім `node_modules` і `bower_components`.
5. `@babel/preset-env` перетворює сучасний синтаксис відповідно до цільових браузерів.
6. `sourcemaps.init({ loadMaps: true })` підхоплює source map, згенеровану Webpack.
7. `rename()` перейменовує вихідний файл на `scripts.min.js`.
8. `sourcemaps.write(".")` записує карту поруч із файлом.
9. `dest()` зберігає обидва файли у `assets/js/`.

### Приклад вихідного коду

```js
const greet = (name = "світе") => {
  console.log(`Привіт, ${name}!`);
};

greet("Gulp");
```

### Приклад підключення

```html
<script src="./js/scripts.min.js"></script>
```

### Важливе уточнення

Попри суфікс `.min.js` у назві, ця задача працює з `mode: "development"` і не запускає окремий крок мінімізації. Назва файлу сама по собі не означає, що код стиснутий. Для production використовується окрема задача `ScriptsBuild.js`.

Якщо Webpack не знаходить точку входу або залежність, перевірте структуру `src/js/`, імпорти та повідомлення помилки в терміналі.

## 8. Sprite.js — створення SVG-спрайту

**Призначення:** об'єднувати окремі SVG-іконки в спрайт і генерувати стилі для їх використання в інтерфейсі.

**Файл:** `gulp/dev/Sprite.js`

### Вхідні файли

`src/images/svg/*.svg` — SVG-файли, що лежать безпосередньо в папці `svg`.

### Що генерується

За поточними налаштуваннями `gulp-svg-sprite` створює:

- `sprite.svg` — SVG-спрайт;
- `sprite.css` — CSS-правила для іконок;
- `src/scss/_sprite.scss` — SCSS-фрагмент, який можна підключити до стилів.

### Основні параметри

- `shape.spacing.padding: 5` — додає внутрішній відступ між формами під час компонування.
- `mode.css` — вмикає CSS-режим генерації.
- `layout: "diagonal"` — розміщує форми за діагональною схемою.
- `sprite: "./sprite.svg"` — ім'я файлу спрайту.
- `prefix: ".%s"` — формує CSS-селектори з назв вихідних SVG.
- `render.css` та `render.scss` — визначають шляхи для згенерованих стилів.

### Використання

Після генерації перевірте вміст `sprite.css` і `_sprite.scss`: точний клас залежить від імені SVG-файлу та шаблону генератора. Підключіть відповідний згенерований SCSS-файл до головного SCSS-файлу, якщо він ще не підключений.

### Послідовність важлива

Спрайт запускається перед `Styles`, оскільки він генерує SCSS-файл. Якщо компілювати стилі раніше, новий або змінений спрайт може не потрапити до поточного CSS.

**Типові проблеми:** іконка не з'являється — перевірте, що SVG знаходиться у правильній папці, має коректну розмітку і його назва відповідає класу; згенерований SCSS не підхопився — перевірте імпорт у головному SCSS-файлі.

## 9. Styles.js — компіляція SCSS у CSS

**Призначення:** компілювати SCSS, автоматично додавати CSS-префікси, зберігати source maps і створювати файл стилів.

**Файл:** `gulp/dev/Styles.js`

### Ланцюжок обробки

```js
function Styles() {
  return src(config.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ basename: "styles", suffix: ".min", extname: ".css" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(config.styles.dest));
}
```

1. Читає SCSS-файли за шаблоном `src/scss/*.scss`.
2. `sourcemaps.init()` починає створення карти відповідності між SCSS і CSS.
3. `sass()` компілює SCSS у CSS. Режим `expanded` залишає форматування читабельним.
4. `postcss([autoprefixer()])` додає браузерні префікси, потрібні згідно з Browserslist.
5. `rename()` задає ім'я `styles.min.css`.
6. `sourcemaps.write(".")` зберігає source map поруч.
7. `dest()` записує результат у `assets/css/`.

### Приклад SCSS

```scss
$brand-color: #2563eb;

.button {
  display: inline-flex;
  align-items: center;
  background: $brand-color;

  &:hover {
    opacity: 0.85;
  }
}
```

Sass розгорне вкладеність і підставить змінну, а Autoprefixer за потреби додасть сумісні префікси.

### Підключення

```html
<link rel="stylesheet" href="./css/styles.min.css">
```

### Важливе уточнення

Як і в задачі Scripts, суфікс `.min.css` тут є назвою файлу, але `outputStyle: "expanded"` навмисно залишає CSS читабельним. Це зручно для розробки. Production-стиснення виконується окремою задачею `StylesBuild.js`.

## 10. WebpImages.js — конвертація растрових зображень у WebP

**Призначення:** конвертувати JPEG та PNG у формат WebP для зменшення розміру зображень і пришвидшення завантаження сайту.

**Файл:** `gulp/dev/WebpImages.js`

```js
function WebpImages() {
  return src(config.images.src, { encoding: false, allowEmpty: true })
    .pipe(cwebp())
    .pipe(dest(config.images.dest));
}
```

### Вхідні та вихідні файли

- Джерело: `src/images/*.{jpg,jpeg,png}`.
- Результат: `assets/images/`.
- Формат: WebP.

Поточний glob охоплює файли безпосередньо в `src/images/`, але не вкладені каталоги й не SVG. SVG обробляються окремою задачею `Sprite`.

### Приклад

Файл `src/images/photo.jpg` після конвертації має з'явитися у `assets/images/` у форматі WebP. Точні параметри якості залежать від налаштувань `gulp-cwebp`; у поточній задачі вони явно не задані.

### Приклад HTML із fallback

```html
<picture>
  <source srcset="./images/photo.webp" type="image/webp">
  <img src="./images/photo.jpg" alt="Опис зображення" loading="lazy">
</picture>
```

Щоб fallback працював, оригінальний JPEG/PNG також має бути скопійований у вихідний сайт іншою задачею або іншим кроком збірки. Сама задача `WebpImages` створює WebP, а не гарантує копіювання оригіналу.

**Типові проблеми:** файл не конвертується — перевірте розширення та розташування; зображення не відображається — перевірте шлях у HTML і наявність згенерованого WebP у папці результату.

## 11. Де змінювати шляхи

Усі основні шляхи зібрані у кореневому файлі `paths.js`. Наприклад:

```js
images: {
  src: "./src/images/*.{jpg,jpeg,png}",
  dest: "./assets/images",
  watch: "./src/images/*.{jpg,jpeg,png}",
  dist: "./dist/images"
}
```

Якщо ви переносите вихідні зображення в іншу папку, змініть відповідні параметри тут. Перевірте також production-конфігурацію та watcher-и: зміна лише одного шляху може залишити частину збірки без оновлення.

## 12. Як запустити та перевірити задачі

```bash
# Встановити залежності
npm ci

# Запустити локальну збірку та BrowserSync
npm run dev

# Створити production-збірку
npm run prod
```

Окремі задачі також експортуються з `gulpfile.babel.js`, тому їх можна запускати через npx gulp, наприклад:

```bash
npx gulp Styles
npx gulp Scripts
npx gulp Html
npx gulp Sprite
```

Окрема задача може залежати від результатів попередньої. Наприклад, перед компіляцією SCSS бажано запустити `Sprite`, якщо стилі імпортують згенерований `_sprite.scss`.

## 13. Швидка таблиця довідки

| Файл | Основна дія | Джерело | Результат розробки |
| --- | --- | --- | --- |
| `Browsersync.js` | Сервер і live reload | `assets/` + watch-шляхи | Локальний сайт |
| `Clean.js` | Очищення | — | Видаляє `assets/` |
| `FontsWoff2.js` | Конвертація TTF | `src/fonts/*.ttf` | `assets/fonts/*.woff2` |
| `Html.js` | Include і перевірка BEM | `src/*.html` та фрагменти | `assets/index.html` |
| `Resources.js` | Копіювання | `src/resources/**/*` | `assets/` |
| `Scripts.js` | Webpack + Babel + source maps | `src/js/**/*.js` | `assets/js/scripts.min.js` |
| `Sprite.js` | SVG-спрайт і стилі | `src/images/svg/*.svg` | `assets/css/` і `src/scss/_sprite.scss` |
| `Styles.js` | SCSS → CSS + Autoprefixer | `src/scss/*.scss` | `assets/css/styles.min.css` |
| `WebpImages.js` | Конвертація в WebP | `src/images/*.{jpg,jpeg,png}` | `assets/images/*.webp` |

---

## 14. Рекомендації щодо подальшого розвитку

1. Додати watcher-и для зображень, шрифтів, SVG та ресурсів, щоб BrowserSync перебудовував їх після змін.
2. Узгодити назви вихідних файлів із реальною поведінкою: `.min` варто використовувати лише після фактичної мінімізації.
3. Для багатосторінкового сайту змінити логіку `Html`, щоб різні HTML-файли не перейменовувалися всі в `index.html`.
4. Додати перевірку існування основних результатів збірки в CI.
5. Для зображень розглянути окрему обробку вкладених каталогів і налаштування якості WebP.
6. Документувати production-задачі окремо: вони створюють `dist/` і можуть використовувати інші налаштування оптимізації.

Документація описує поточну реалізацію. Якщо змінюються задачі або `paths.js`, оновлюйте відповідні розділи цього документа разом із кодом.
