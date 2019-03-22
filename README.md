# kandinski.js
js library to unit test css.

## Why kandinski.js

Why not!
The main goal of kandinski.js is to use the power and stability of unit test to test your Application css and avoid unexpected issues or regression.

### Installing

```
$ yarn add kandinskijs
```

### Usage overview

```javascript
const kisk = require("kandinskijs");

describe("component css test", function () {
  const url = "https://siteurl.com";
  const localCssPath = "path/local.css";

  before(async function () {
    await kisk.init(url, localCssPath);
  });

  after(async function () {
    await kisk.destroy();
  });

  context("mobile viewport", function () {
    before(async function () {
      const mobileViewport = { width: 320, height: 1 };
      await kisk.getPage(mobileViewport);
    });
    after(async function () {
      await kisk.page.close();
    });
    it("h2 should have a display: flex", async function () {
      const selector = ".component";
      const cssProperty = "display";
      const display = await kisk.getCSSProperty(page, selector, cssProperty);

      expect(display).to.eql("flex");
    });
  });
});
```
Run the [demo](#demo) locally to try it on your local machine.

## API
**init** -
Initialize kandinskijs with the url of your application and add to the page your local css.
```javascript
.init(url,cssPath)
```
**destroy** -
Destroy the kandinskijs instance.
```javascript
.destroy()
```
**getPage** -
Get the page with a specific viewport, and set kandinskijs page property.
```javascript
.getPage(viewport)
```
**getCSSProperty** -
Return the css property value associated to querySelector
```javascript
.getCSSProperty(querySelector, property)
```
**getPctCSSProperty** -
Return the css property value associated to querySelector expressed in percentage, value ammitted for property parameters are [width,height].
```javascript
.getPctCSSProperty(querySelector, property)
```
**getInnerText** -
Return the text of the querySelector specified.
```javascript
.getInnerText(querySelector)
```

**cssHelper** -
documentation in progress ...

## Demo
You can find demo files under **/demo** folder.

- `<div><h2>Kandinskijs</h2></div>` html element under test.
- local css defined in `localBase.css`.
- test suite, using kandinskijs, is defined in `cssTest.js`

### start the local server
Open a CLI and execute:
```
$ yarn run demo-server
```
### run the demo tests
Open another CLI and run css unit tests:
```
$ yarn run demo-test
```

The demo test suite uses *Mocha* & *Chai*.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/gian8/kandinskijs/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/gian8/kandinskijs/blob/master/LICENSE) file for details



*Future implementation:*
- Add css code coverage index
