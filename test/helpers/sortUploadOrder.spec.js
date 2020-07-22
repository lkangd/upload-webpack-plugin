import sortUploadOrder from '../../src/helpers/sortUploadOrder';

describe('helpers:sortUploadOrder', () => {
  const files = [
    'others/example.d45b548.txt',
    'others/dimmed.ff2b498.woff',
    'others/dimmed.424ed69.ttf',
    'static/loading.gif',
    'others/example.2f8a720.zip',
    'static/static.jpg',
    'images/happy-boy.b85a8a2.gif',
    'static/favicon.ico',
    'dynamicInDynamic.088e3a7.6879457.bundle.js',
    'dynamic.56ad341.bundle.css',
    'dynamic.56ad341.2a7837e.bundle.js',
    'dynamicSub.1e2a156.bundle.css',
    'dynamicSub.1e2a156.2dce103.bundle.js',
    'manifest.6cf1b05.cb9796c.js',
    'vendor.d0c2f3c.4d25160.bundle.js',
    'common.cca58f5.bundle.css',
    'common.cca58f5.abae7d8.bundle.js',
    'main.dc19a08.564a3f0.bundle.js',
    'sub.7f0f75e.8dcdfd1.bundle.js',
    'sub.html',
    'index.html',
  ];
  test('should sort files order by extOrderTemplate', () => {
    let correctResult = [
      'others/example.d45b548.txt',
      'others/dimmed.424ed69.ttf',
      'others/dimmed.ff2b498.woff',
      'images/happy-boy.b85a8a2.gif',
      'static/loading.gif',
      'others/example.2f8a720.zip',
      'static/static.jpg',
      'static/favicon.ico',
      'common.cca58f5.bundle.css',
      'dynamicSub.1e2a156.bundle.css',
      'dynamic.56ad341.bundle.css',
      'sub.7f0f75e.8dcdfd1.bundle.js',
      'main.dc19a08.564a3f0.bundle.js',
      'common.cca58f5.abae7d8.bundle.js',
      'vendor.d0c2f3c.4d25160.bundle.js',
      'manifest.6cf1b05.cb9796c.js',
      'dynamicSub.1e2a156.2dce103.bundle.js',
      'dynamic.56ad341.2a7837e.bundle.js',
      'dynamicInDynamic.088e3a7.6879457.bundle.js',
      'index.html',
      'sub.html',
    ];
    let result = sortUploadOrder(files, ['.woff', '.gif', '.zip', '.jpg', '.ico', '.css', '.js', '.html']);
    expect(result).toHaveProperty('all');
    expect(result).toHaveProperty('priority');
    expect(result).toHaveProperty('nonPriority');
    expect(result.all).not.toEqual(files);
    expect(result.all).toEqual(correctResult);
    expect(result.priority).toEqual(correctResult.slice(0, 2));
    expect(result.nonPriority).toEqual(correctResult.slice(2));

    result = sortUploadOrder(files, []);
    expect(result.all).toEqual(files);
    expect(result.all).not.toEqual(correctResult);
    expect(result.priority).toEqual(files);
    expect(result.nonPriority).toEqual([]);

    correctResult = [
      'others/example.d45b548.txt',
      'others/dimmed.ff2b498.woff',
      'others/dimmed.424ed69.ttf',
      'static/loading.gif',
      'others/example.2f8a720.zip',
      'static/static.jpg',
      'images/happy-boy.b85a8a2.gif',
      'static/favicon.ico',
      'common.cca58f5.bundle.css',
      'dynamicSub.1e2a156.bundle.css',
      'dynamic.56ad341.bundle.css',
      'sub.7f0f75e.8dcdfd1.bundle.js',
      'main.dc19a08.564a3f0.bundle.js',
      'common.cca58f5.abae7d8.bundle.js',
      'vendor.d0c2f3c.4d25160.bundle.js',
      'manifest.6cf1b05.cb9796c.js',
      'dynamicSub.1e2a156.2dce103.bundle.js',
      'dynamic.56ad341.2a7837e.bundle.js',
      'dynamicInDynamic.088e3a7.6879457.bundle.js',
      'index.html',
      'sub.html',
    ];
    result = sortUploadOrder(files);
    expect(result.all).toEqual(correctResult);
    expect(result.all).not.toEqual(files);
    expect(result.priority).toEqual(correctResult.slice(0, 8));
    expect(result.nonPriority).toEqual(correctResult.slice(8));

    result = sortUploadOrder();
    expect(result.all).toEqual([]);
    expect(result.priority).toEqual([]);
    expect(result.nonPriority).toEqual([]);
  });
});
