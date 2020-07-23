const defferTimes = [0, 100, 200, 300];
const pickDefferTime = () => defferTimes[Math.floor(Math.random() * defferTimes.length)];
const cdnPrefix = 'https://custom.lkangd.com/';

module.exports = {
  sync(source, name) {
    return `${cdnPrefix}${name}`;
  },
  syncVoidReturn(source, name) {},
  async(source, name) {
    return new Promise(resolve => {
      setTimeout(() => resolve(`${cdnPrefix}${name}`), pickDefferTime());
    });
  },
  asyncVoidReturn(source, name) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), pickDefferTime());
    });
  },
  gather(sourceMap) {
    return Object.keys(sourceMap).reduce((result, name) => {
      result[name] = `${cdnPrefix}${name}`;
      return result;
    }, {});
  },
  gatherVoidReturn(sourceMap) {},
  };
