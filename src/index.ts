import * as moo from 'moo';

export interface Options {
  headStart?: string;
  headEnd?: string;
  bodyStart?: string;
  bodyEnd?: string;
}

/**
 * This isn’t a complete HTML parser by any means; this is a bare-bones lexer
 * that only gives us rudimentary understanding of certain tags (namely, <body>
 * and <head>, as well as comments so they can be ignored). Moo is basically a
 * safer, glorified RegEx parser, so we’re trading off flexibility for
 * performance.
 */
function findHeadAndBody(html: string) {
  const toLower = (text: string) =>
    text.trim().replace(/\s/g, '').toLowerCase(); // normalize tags to lowercase, and strip any whitespace
  const lexer = moo.states({
    main: {
      commentStart: { match: /<!--/, push: 'comment' },
      docType: { match: /<![^>]+>/, lineBreaks: true },
      tagOpen: { match: /<\s*[a-zA-Z-]+[^>]*>/, value: toLower },
      tagClose: { match: /<\s*\/[a-zA-Z-]+[^>]*>/, value: toLower },
      ws: { match: /[\s|\t]+/, lineBreaks: true },
      any: { match: /./ },
    },
    comment: {
      commentEnd: { match: /-->/, lineBreaks: true, pop: 1 }, // exit comment
      commentAny: { match: /./, lineBreaks: true },
    },
  });
  return lexer.reset(html);
}

export function injectHTML(html: string, options: Options): string {
  let code = html;
  let charOffset = 0;
  const lexer = findHeadAndBody(html);

  // iterate through DOM
  let node = lexer.next();
  while (node) {
    const textToInsert =
      (node.value === '<head>' && options.headStart) ||
      (node.value === '<body>' && options.bodyStart) ||
      (node.value === '</head>' && options.headEnd) ||
      (node.value === '</body>' && options.bodyEnd);
    if (textToInsert) {
      const tagOffset = node.type === 'tagOpen' ? node.text.length : 0; // if <head> or <body> insert after match; otherwise insert before (at pos)
      let insertion = textToInsert.replace(/^\s*/, '  ');
      if (node.type === 'tagOpen') insertion = '\n  ' + insertion;
      if (node.type === 'tagClose') insertion = insertion + '\n  ';
      code = insert(code, insertion, node.offset + tagOffset + charOffset); // inject HTML at position
      charOffset += insertion.length;
    }

    node = lexer.next(); // visit next node, until we’re at the end of the document (will return `undefined`)
  }

  return code;
}

/** Insert any string at certain position */
export function insert(text: string, insertion: string, pos: number): string {
  return text.substring(0, pos) + insertion + text.substring(pos);
}

export default injectHTML;
