import updateUrlInSource from '../../src/helpers/updateUrlInSource';

describe('helpers:updateUrlInSource', () => {
  const urls = Object.create({ '/out/_out.000.jpg': '/out/_out.000.jpg/out/_out.000.jpg' });
  urls['/foo/_foo.123.jpg'] = 'https://cdn.lkangd.com/foo/_foo.123.jpg';
  urls['/bar/_bar.456.png'] = 'https://cdn.lkangd.com/bar/_bar.456.png';
  urls['./_baz.789.png'] = 'https://cdn.lkangd.com/baz/_baz.789.png';
  test('should replace url in css file', () => {
    const source = `.foo{background:url(/foo/_foo.123.jpg)} .bar{background:url(/bar/_bar.456.png)}`;
    let result = updateUrlInSource(source, 'template.css', urls);
    expect(result).toBe(
      `.foo{background:url(https://cdn.lkangd.com/foo/_foo.123.jpg)} .bar{background:url(https://cdn.lkangd.com/bar/_bar.456.png)}`,
    );
    result = updateUrlInSource(source, 'template.css', urls, true);
    expect(result).toBe(
      `.foo{background:url(https://cdn.lkangd.com/foo/_foo.123.jpg)} .bar{background:url(https://cdn.lkangd.com/bar/_bar.456.png)}`,
    );
  });
  test('should replace url in js file', () => {
    const source = `const directSrc = "/direct/_foo.123.jpg"; const directSrc2 = "/direct/_baz.789.png"; const src = someArgs + '/foo/_foo.123.jpg'; const srcWrap = (((someArgs) + '/foo/_foo.123.jpg')); const srcs = { src: ((someArgs) + '/bar/_bar.456.png') }`;
    let result = updateUrlInSource(source, 'template.js', urls);
    expect(result).toBe(
      `const directSrc = "/direct/_foo.123.jpg"; const directSrc2 = "/direct/_baz.789.png"; const src ='https://cdn.lkangd.com/foo/_foo.123.jpg'; const srcWrap =(('https://cdn.lkangd.com/foo/_foo.123.jpg')); const srcs = { src:('https://cdn.lkangd.com/bar/_bar.456.png') }`,
    );
    result = updateUrlInSource(source, 'template.js', urls, true);
    expect(result).toBe(
      `const directSrc ="https://cdn.lkangd.com/foo/_foo.123.jpg"; const directSrc2 = "https://cdn.lkangd.com/baz/_baz.789.png"; const src ='https://cdn.lkangd.com/foo/_foo.123.jpg'; const srcWrap =(('https://cdn.lkangd.com/foo/_foo.123.jpg')); const srcs = { src:('https://cdn.lkangd.com/bar/_bar.456.png') }`,
    );
  });
  test('should replace url in html file', () => {
    const source = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
        <link rel="icon" href="/static/favicon.ico" />
        <title>Upload Webpack Plugin</title>
      <link href="https://cdn.lkangd.com/entry/common.cca58f5.bundle.css" rel="stylesheet"></head>
      <body>
      <img src="/foo/_foo.123.jpg" alt="foo"/>
      <img src=/foo/_foo.123.jpg alt=foo/>
      <img src="/bar/_bar.456.png" alt="bar"/>
      <img src=/bar/_bar.456.png alt=bar/>
      </body>
    </html>`;
    let result = updateUrlInSource(source, 'template.html', urls);
    expect(result).toBe(
      `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
        <link rel="icon" href="/static/favicon.ico" />
        <title>Upload Webpack Plugin</title>
      <link href="https://cdn.lkangd.com/entry/common.cca58f5.bundle.css" rel="stylesheet"></head>
      <body>
      <img src="https://cdn.lkangd.com/foo/_foo.123.jpg" alt="foo"/>
      <img src=https://cdn.lkangd.com/foo/_foo.123.jpg alt=foo/>
      <img src="https://cdn.lkangd.com/bar/_bar.456.png" alt="bar"/>
      <img src=https://cdn.lkangd.com/bar/_bar.456.png alt=bar/>
      </body>
    </html>`,
    );
    result = updateUrlInSource(source, 'template.html', urls, true);
    expect(result).toBe(
      `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />
        <link rel="icon" href="/static/favicon.ico" />
        <title>Upload Webpack Plugin</title>
      <link href="https://cdn.lkangd.com/entry/common.cca58f5.bundle.css" rel="stylesheet"></head>
      <body>
      <img src="https://cdn.lkangd.com/foo/_foo.123.jpg" alt="foo"/>
      <img src=https://cdn.lkangd.com/foo/_foo.123.jpg alt=foo/>
      <img src="https://cdn.lkangd.com/bar/_bar.456.png" alt="bar"/>
      <img src=https://cdn.lkangd.com/bar/_bar.456.png alt=bar/>
      </body>
    </html>`,
    );
  });
  test('should do nothing when not match any RegExp', () => {
    const source = `.foo{background:url(/foo/_foo.123.jpg)} .bar{background:url(/bar/_bar.456.png)}`;
    let result = updateUrlInSource(source, 'template.abc', urls);
    expect(result).toBe(source);
    result = updateUrlInSource(source, 'template.abc', urls, true);
    expect(result).toBe(source);
  });
});
