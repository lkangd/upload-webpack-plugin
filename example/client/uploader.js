module.exports = function (source, name, callback) {
  // callback(`${cdnPrefix}${name}`);
  return new Promise(resolve => {
    // const cdnPrefix = 'https://cdn.lkangd.com/';
    const cdnPrefix = '';
    // console.log('uploaded source :>> ', source);
    setTimeout(() => {
      console.log('name :>> ', name);
      if (name !== 'dynamicInDynamic.3571b1f.ff7d2ad.bundle.js') {
        resolve(`${cdnPrefix}${name}`);
      } else {
        resolve();
      }
    }, 0);
  });
};
