import numberFormat from './numberFormat';
import timeFormat from './timeFormat';

export {
  numberFormat,
  timeFormat
};

export function createFromMetaInfo(meta, localeInfo) {
  if (meta && meta.qNumFormat && ['D', 'T', 'TS', 'IV'].indexOf(meta.qNumFormat.qType) !== -1) {
    return timeFormat(meta.qNumFormat.qFmt, meta.qNumFormat.qType, localeInfo);
  }
  let pattern = '#';
  let thousand = localeInfo ? localeInfo.qThousandSep : ',';
  let decimal = localeInfo ? localeInfo.qDecimalSep : '.';
  let type = 'U';
  let isAuto = meta && !!meta.qIsAutoFormat;
  if (meta && meta.qNumFormat) {
    pattern = meta.qNumFormat.qFmt || pattern;
    thousand = meta.qNumFormat.qThou || thousand;
    decimal = meta.qNumFormat.qDec || decimal;
    type = meta.qNumFormat.qType || type;
    isAuto = isAuto && ['M'].indexOf(meta.qNumFormat.qType) === -1;
  }

  if (isAuto) {
    pattern = `#${decimal}##A`;
  }
  return numberFormat(pattern, thousand, decimal, type, localeInfo);
}
