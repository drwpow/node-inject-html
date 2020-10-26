# 🧷 node-inject-html

Fast, lightweight HTML injection via string, for when you don’t have access to
the DOM (e.g. Node.js).

⚠️ If you _do_ have access to the DOM, **don’t use this!** Use
[`appendChild()`][appendchild] instead.

This library only has 1 dependency: [moo][moo], a highly-optimized JS lexer.

## Example

```
npm i node-inject-html
```

```js
import { inject } from 'node-inject-html';

const html = `<!doctype HTML>
<html>
  <head>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;

inject(html, {
  headStart: '<script src="https://someanalyticsfunction.com"></script>',
  headEnd:
    '<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">',
  bodyStart:
    '<noscript>You need JavaScript enabled to run this application.</noscript>',
  bodyEnd: '<script async src="./hmr.js"></script>',
});

// <!doctype HTML>
// <html>
//   <head>
//     <script src="https://someanalyticsfunction.com"></script> <!-- NEW -->
//     <link rel="stylesheet" href="/styles.css" />
//     <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> <!-- NEW -->
//   </head>
//   <body>
//     <noscript>You need JavaScript enabled to run this application.</noscript> <!-- NEW -->
//     <div id="app"></div>
//     <script async src="./hmr.js"></script>
//   </body>
// </html>
```

## FAQ

#### When do I need this?

This is a useful tool for SSR or any time you need to scan the DOM without
having access to the DOM itself, like in Node.

#### Can I use this in conjunction with jsdom, cheerio, etc.?

Yes! This library is lightweight and performant enough you may find it handles
better than a heavy DOM parser / AST library.

#### Can I insert any HTML?

Yes! Any HTML (but note that malformed HTML will break your app—this won’t
validate it!)

#### I need an AST. Can this do that?

No. Try [node-html-parser][node-html-parser] or something.

#### Can I add other hooks?

Yes! Contributions are welcome. Please see [CONTRIBUTING.md](./CONTRIBUTING.md)
to get started.

#### Can I use this in a browser?

**No!**️ If you are running this in the context of a browser, you should use
[`appendChild()`][appendchild] instead.

[appendchild]: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
[node-html-parser]: https://github.com/taoqf/node-html-parser
[moo]: https://github.com/no-context/moo
