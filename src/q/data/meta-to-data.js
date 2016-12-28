import resolve from '../../core/data/json-path-resolver';

const metaToData = [
  {
    pattern: /qDimensionInfo/,
    data: 'qDataPages//qMatrix/'
  },
  {
    pattern: /(qMeasureInfo\/)(\d+)/,
    pre(path, meta) {
      const pathToDimz = `${path.substr(0, path.indexOf('qMeasureInfo'))}qDimensionInfo`;
      const numDimz = resolve(pathToDimz, meta).length;
      return path.replace(/(qMeasureInfo\/)(\d+)/, (match, m, idx) =>
   m + (numDimz + +idx)
);
    },
    data(match, m, idx) {
      return ['qDataPages', '', 'qMatrix', '', +idx].join('/');
    }
    // data: "qDataPages//qMatrix//"
  },
  {
    pattern: /qAttrExprInfo/,
    data: 'qAttrExps/qValues'
  }
];

export default function metaToDataPath(path, meta) {
  let p = path;
  for (let i = 0; i < metaToData.length; i++) {
    if (metaToData[i].pattern.test(path)) {
      if (metaToData[i].pre) {
        p = metaToData[i].pre(p, meta);
      }
      p = p.replace(metaToData[i].pattern, metaToData[i].data);
    }
  }

  return p;
}
