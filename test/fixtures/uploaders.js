const defferTimes = [0, 100, 200, 300];
const pickDefferTime = () => defferTimes[Math.floor(Math.random() * defferTimes.length)];
const CDN_PREFIX = 'https://custom.lkangd.com/';

module.exports = {
  sync(cdnPrefix = CDN_PREFIX) {
    return function (source, name) {
      return `${cdnPrefix}${name}`;
    };
  },
  syncVoidReturn(cdnPrefix = CDN_PREFIX) {
    return function (source, name) {};
  },
  async(cdnPrefix = CDN_PREFIX) {
    return function (source, name) {
      return new Promise(resolve => {
        setTimeout(() => resolve(`${cdnPrefix}${name}`), pickDefferTime());
      });
    };
  },
  asyncVoidReturn(cdnPrefix = CDN_PREFIX) {
    return function (source, name) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), pickDefferTime());
      });
    };
  },
  gather(cdnPrefix = CDN_PREFIX) {
    return function (sourceMap) {
      return Object.keys(sourceMap).reduce((result, name) => {
        result[name] = `${cdnPrefix}${name}`;
        return result;
      }, {});
    };
  },
  gatherVoidReturn(cdnPrefix = CDN_PREFIX) {
    return function (sourceMap) {};
  },
};
