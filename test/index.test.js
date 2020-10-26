const { injectHTML } = require('../dist/cjs/index.js');

describe('', () => {
  it('basic', () => {
    expect(
      injectHTML(
        `<!doctype HTML>
<html>
  <head>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <BODY>
    <!-- </body> -->
    <div id="app"></div>
  </BODY>
</html>`,
        {
          headStart:
            '<script src="https://someanalyticsfunction.com"></script>',
          headEnd:
            '<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">',
          bodyStart:
            '<noscript>You need JavaScript enabled to run this application.</noscript>',
          bodyEnd: '<script async src="./hmr.js"></script>',
        }
      )
    ).toEqual(`<!doctype HTML>
<html>
  <head>
    <script src="https://someanalyticsfunction.com"></script>
    <link rel="stylesheet" href="styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  </head>
  <BODY>
    <noscript>You need JavaScript enabled to run this application.</noscript>
    <!-- </body> -->
    <div id="app"></div>
    <script async src="./hmr.js"></script>
  </BODY>
</html>`);
  });
});
