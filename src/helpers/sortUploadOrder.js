export default function sortUploadOrder(filenames = [], extOrderTemplate = ['.css', '.js', '.html']) {
  const toSorts = filenames.slice();
  const levelMap = new Map();
  const extOrder = extOrderTemplate.map((ext, i) => {
    const extRegExp = new RegExp(`\\${ext}$`);
    levelMap.set(extRegExp, i);
    return extRegExp;
  });
  const all = toSorts.sort((a, b) => {
    const matchExtB = extOrder.find(ext => ext.test(b));
    if (matchExtB) {
      const extLevelB = levelMap.get(matchExtB);
      const matchExtA = extOrder.find(ext => ext.test(a));
      if (matchExtA) {
        const extLevelA = levelMap.get(matchExtA);
        if (extLevelB < extLevelA) return 1;
      }
      return -1;
    }
    return 1;
  });
  let extEdge = all.findIndex(filename => extOrder.find(ext => ext.test(filename)));
  extEdge = extEdge === -1 ? all.length : extEdge;
  return { all, priority: all.slice(0, extEdge), nonPriority: all.slice(extEdge) };
}
