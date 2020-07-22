const defferTimes = [0, 100, 200, 300];
const pickDefferTime = () => defferTimes[Math.floor(Math.random() * defferTimes.length)];
// const cdnPrefix = 'https://custom.lkangd.com/';
const cdnPrefix = '';

module.exports = function uploader(source, name) {
  // return `${cdnPrefix}${name}`;
  return new Promise(resolve => {
    setTimeout(() => resolve(`${cdnPrefix}${name}`), pickDefferTime());
  });
};

// module.exports = function uploader(sourceMap) {
//   return Object.keys(sourceMap).reduce((result, name) => {
//     result[name] = `${cdnPrefix}${name}`;
//     return result;
//   }, {});
// };
