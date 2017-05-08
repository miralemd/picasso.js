import formatter from 'number-format.js';

function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

/*
* Created by Miralem Drek (mek)
* Re-formatted and fitted into picasso by Hannes Lindquist (bge)
*/
const SIprefixes = {
    3: 'k',
    6: 'M',
    9: 'G',
    12: 'T',
    15: 'P',
    18: 'E',
    21: 'Z',
    24: 'Y',
    '-3': 'm',
    '-6': 'μ',
    '-9': 'n',
    '-12': 'p',
    '-15': 'f',
    '-18': 'a',
    '-21': 'z',
    '-24': 'y'
  },
  percentage = /%$/,
  //    scientific = /e[\+\-][0-9]+/,
  radix = /^\(r(0[2-9]|[12]\d|3[0-6])\)/i,
  oct = /^\(oct\)/i,
  dec = /^\(dec\)/i,
  hex = /^\(hex\)/i,
  bin = /^\(bin\)/i,
  rom = /^\(rom\)/i,
  functional = /^(\(rom\)|\(bin\)|\(hex\)|\(dec\)|\(oct\)|\(r(0[2-9]|[12]\d|3[0-6])\))/i;

function formatRadix(value, fradix, pattern, decimal) {
  value = value.toString(fradix);
  if (pattern[1] === pattern[1].toUpperCase()) {
    value = value.toUpperCase();
  }
  if (value.length - value.indexOf('.') > 10) { // limit to 10 decimal places
    value = value.slice(0, value.indexOf('.') + 11);
  }

  return value.replace('.', decimal || '.');
}

// value must be an integer
// value must not be in scientific notation
function formatRoman(value, pattern) {
  let i,
    s = '',
    v = Number(String(value).slice(-3)),
    nThousands = (value - v) / 1000,
    decimal = [0, 1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900].reverse(),
    numeral = ['0', 'I', 'IV', 'V', 'IX', 'X', 'XL', 'L', 'XC', 'C', 'CD', 'D', 'CM'].reverse();

  while (v > 0) {
    for (i = 0; i < decimal.length; i++) {
      if (decimal[i] <= v) {
        s += numeral[i];
        v -= decimal[i];
        break;
      }
    }
  }

  for (i = 0; i < nThousands; i++) {
    s = `M${s}`;
  }

  if (pattern[1] !== pattern[1].toUpperCase()) {
    s = s.toLowerCase();
  }
  return s;
}

function formatFunctional(value, pattern, d) {
  let temp;
  if (radix.test(pattern)) {
    value = formatRadix(value, Number(/\d{2}/.exec(pattern)[0]), pattern, d);
  } else if (oct.test(pattern)) {
    value = formatRadix(value, 8, pattern, d);
  } else if (dec.test(pattern)) {
    value = formatRadix(value, 10, pattern, d);
  } else if (hex.test(pattern)) {
    value = formatRadix(value, 16, pattern, d);
  } else if (bin.test(pattern)) {
    value = formatRadix(value, 2, pattern, d);
  } else if (rom.test(pattern)) {
    temp = '';
    if (value < 0) {
      temp = '-';
      value = -value;
    }
    value = Math.floor(value);
    if (value === 0) {
      value = '0';
    } else if (value <= 500000) { // limit in engine
      value = formatRoman(value, pattern);
      value = temp + value;
    } else {
      value = pattern + temp + value.toExponential(0); // to return same result as engine
    }
  }

  return value;
}

function escape(value, flags, justStr) {
  const str = escapeRegExp(value);
  if (justStr) {
    return str;
  }
  return new RegExp(str || '', flags);
}

function createRegExp(thousand, decimal) {
  if (decimal) {
    decimal = escapeRegExp(decimal);
  }
  if (thousand) {
    thousand = escapeRegExp(thousand);
  }
  return new RegExp(`(?:[#0]+${thousand})?[#0]+(?:${decimal}[#0]+)?`);
}

function preparePattern(o, t, d) {
  let parts,
    lastPart,
    pattern = o.pattern,
    numericPattern,
    prefix,
    postfix,
    groupTemp,
    decTemp,
    temp,
    regex;

  if (pattern.indexOf('A') >= 0) { // abbreviate SI
    pattern = pattern.replace('A', '');
    o.abbreviate = true;
  }

  // extract the numeric part from the pattern
  regex = createRegExp(t, d);
  numericPattern = pattern.match(regex);
  numericPattern = numericPattern ? numericPattern[0] : '';
  prefix = numericPattern ? pattern.substr(0, pattern.indexOf(numericPattern)) : pattern;
  postfix = numericPattern ? pattern.substring(pattern.indexOf(numericPattern) + numericPattern.length) : '';

  if (!numericPattern) {
    numericPattern = pattern ? '#' : '##########';
  }

  if (t && t === d) { // ignore grouping if grouping separator is same as decimal separator
    // extract decimal part
    parts = numericPattern.split(d);
    lastPart = parts.pop();
    numericPattern = parts.join('') + d + lastPart;
    t = '';
  }

  // formatting library does not support multiple characters as separator (nor +-).
  // do a temporary replacement
  groupTemp = t;
  t = /,/.test(d) ? '¤' : ',';
  if (groupTemp) {
    numericPattern = numericPattern.replace(escape(groupTemp, 'g'), t);
  }

  decTemp = d;
  d = '.';
  if (decTemp) {
    numericPattern = numericPattern.replace(escape(decTemp, 'g'), d);
  }

  temp = numericPattern.match(/#/g);
  temp = temp ? temp.length : 0;

  o.prefix = prefix || '';
  o.postfix = postfix || '';
  o.pattern = pattern;
  o.percentage = percentage.test(pattern);
  o.numericPattern = numericPattern || '';
  o.numericRegex = new RegExp(`${escape(t, null, true)}|${escape(d, null, true)}`, 'g');
  o.groupTemp = groupTemp;
  o.decTemp = decTemp;
  o.t = t;
  o.d = d;
  o.temp = temp;
}

class NumberFormatter {
  /**
   * @name NumberFormatter
   * @constructs
   * @param {Object} localeInfo
   * @param {String} pattern
   * @param {String} [thousand]
   * @param {String} [decimal]
   * @param {String} [type]
   */
  constructor(localeInfo, pattern, thousand, decimal, type) {
    this.localeInfo = localeInfo;
    this.pattern = pattern;
    this.thousandDelimiter = thousand || ',';
    this.decimalDelimiter = decimal || '.';
    this.type = type || 'numeric';

    this.prepare();
  }

  clone() {
    const n = new NumberFormatter(this.localeInfo, this.pattern, this.thousandDelimiter, this.decimalDelimiter, this.type);
    n.subtype = this.subtype;
    return n;
  }

  /**
   * Formats a number according to a specific pattern.
   * Use # for optional numbers and 0 for padding.
   * @param {Number} value Number to format.
   * @param {String} [pattern] The pattern to apply.
   * @param {String} [t] Grouping separator.
   * @param {String} [d] Decimal delimiter.
   * @example
   * format(10, "0") // 10;
   * format(10, "#") // 10;
   * format(10, "##.#") // 10;
   * format(10, "##.0") // 10.0;
   * format(10, "000") // 010;
   * format(10.123, "0.0") // 10.1;
   * format(10.123, "0.00##") // 10.123; // at least 2 decimals, never more than 4
   * format(123456789, "#,###") // 123,456,789;
   * format(123456789, "####-####", "-") // 1-2345-6789;
   * format(10000, "#A") // 10k,  A -> SI abbreviation
   * format(1234567, "#.###A") // 1.235M;
   * format(0.0001, "#.#A") // 0.1m;
   *
   * format(0.257, "0.0%") // 25.7%; // will multiply by 100
   * format(9876, "$#,###") // $9,876;
   * format(-9876, "$#,###;$(#,###)") // $(9,876); // use ; for alternative formatting for negative values
   * format(10, "(r16)") // a; // radix 16
   * format(15, "(hex)") // f; // same as (r16)
   * format(15, "(HEX)") // F;
   * format(10, "(bin)") // 1010; // same as (r02)
   * format(10, "(oct)") // 12; // same as (r08)
   */
  format(value, pattern, t, d) {
    this.prepare(pattern, t, d);
    return this.formatValue(value);
  }

  prepare(pattern, t, d) {
    let prep;

    if (typeof pattern === 'undefined') { pattern = this.pattern; }
    if (typeof t === 'undefined') { t = this.thousandDelimiter; }
    if (typeof d === 'undefined') { d = this.decimalDelimiter; }


    if (!pattern) {
      this._prepared = { pattern: false };
      return;
    }

    this._prepared = {
      positive: {
        d,
        t,
        abbreviate: false,
        isFunctional: false,
        prefix: '',
        postfix: ''
      },
      negative: {
        d,
        t,
        abbreviate: false,
        isFunctional: false,
        prefix: '',
        postfix: ''
      },
      zero: {
        d,
        t,
        abbreviate: false,
        isFunctional: false,
        prefix: '',
        postfix: ''
      }
    };
    prep = this._prepared;

    const patternSeparator = this.localeInfo ? this.localeInfo.qListSep : ';';

    pattern = pattern.split(patternSeparator);
    prep.positive.pattern = pattern[0];
    prep.negative.pattern = pattern[1];
    prep.zero.pattern = pattern[2];
    if (functional.test(pattern[0])) {
      prep.positive.isFunctional = true;
    }
    if (!pattern[1]) {
      prep.negative = false;
    } else if (functional.test(pattern[1])) {
      prep.negative.isFunctional = true;
    }
    if (!pattern[2]) {
      prep.zero = false;
    } else if (functional.test(pattern[2])) {
      prep.zero.isFunctional = true;
    }

    if (!prep.positive.isFunctional) {
      preparePattern(prep.positive, t, d);
    }
    if (prep.negative && !prep.negative.isFunctional) {
      preparePattern(prep.negative, t, d);
    }
    if (prep.zero && !prep.zero.isFunctional) {
      preparePattern(prep.zero, t, d);
    }
  }

  formatValue(value) {
    let prep = this._prepared,
      temp,
      exponent,
      abbr = '',
      absValue,
      num,
      sciValue = '',
      d,
      t,
      i,
      numericPattern,
      decimalPartPattern,
      original = value;

    if (isNaN(value)) {
      return `${original}`;
    }

    value = +value;

    if (prep.pattern === false) {
      return value.toString();
    }

    if (value === 0 && prep.zero) {
      prep = prep.zero;
      return prep.pattern;
    } else if (value < 0 && prep.negative) {
      prep = prep.negative;
      value = -value;
    } else {
      prep = prep.positive;
    }
    d = prep.d;
    t = prep.t;

    if (prep.isFunctional) {
      value = formatFunctional(value, prep.pattern, d);
    } else {
      if (prep.percentage) {
        value *= 100;
      }

      if (prep.abbreviate) {
        exponent = Number(Number(value).toExponential().split('e')[1]);
        exponent -= (exponent % 3);
        if (exponent in SIprefixes) {
          abbr = SIprefixes[exponent];
          value /= Math.pow(10, exponent);
        }
      }

      absValue = Math.abs(value);
      temp = prep.temp;
      numericPattern = prep.numericPattern;
      decimalPartPattern = numericPattern.split(d)[1];

      if (this.type === 'I') {
        value = Math.round(value);
      }
      num = value;

      if (!decimalPartPattern && numericPattern.slice(-1)[0] === '#') {
        if (absValue >= Math.pow(10, temp) || absValue < 1 || absValue < 1e-4) {
          if (value === 0) {
            value = '0';
          } else if (absValue < 1e-4 || absValue >= 1e20) { // engine always formats values < 1e-4 in scientific form, values >= 1e20 can only be represented in scientific form
            value = num.toExponential(Math.max(1, Math.min(14, temp)) - 1);
            value = value.replace(/\.?0+(?=e)/, '');
            sciValue = '';
          } else {
            value = value.toPrecision(Math.max(1, Math.min(14, temp)));
            if (value.indexOf('.') >= 0) {
              value = value.replace(value.indexOf('e') < 0 ? /0+$/ : /\.?0+(?=e)/, '');
              value = value.replace('.', d);
            }
          }
        } else {
          numericPattern += d;
          temp = Math.max(0, Math.min(20, temp - Math.ceil(Math.log(absValue) / Math.log(10))));
          for (i = 0; i < temp; i++) {
            numericPattern += '#';
          }

          value = formatter(numericPattern, value);
        }
      } else if (absValue >= 1e15 || (absValue > 0 && absValue <= 1e-14)) {
        value = absValue ? absValue.toExponential(15).replace(/\.?0+(?=e)/, '') : '0';
      } else {
        const wholePart = Number((value.toFixed(Math.min(20, decimalPartPattern ? decimalPartPattern.length : 0))).split('.')[0]);
        let wholePartPattern = numericPattern.split(d)[0];
        wholePartPattern += d;

        value = formatter(wholePartPattern, wholePart) || '0';

        if (decimalPartPattern) {
          const nDecimals = Math.max(0, Math.min(14, decimalPartPattern.length)); // the length of e.g. 0000#####
          const nZeroes = decimalPartPattern.replace(/#+$/, '').length;
          let decimalPart = (absValue % 1).toFixed(nDecimals).slice(2).replace(/0+$/, ''); // remove trailing zeroes

          for (i = decimalPart.length; i < nZeroes; i++) {
            decimalPart += '0';
          }

          if (decimalPart) {
            value += d + decimalPart;
          }
        } else if (wholePart === 0) { // to avoid "-" being prefixed to value
          num = 0;
        }
      }

      value = value.replace(prep.numericRegex, (m) => {
        if (m === t) {
          return prep.groupTemp;
        } else if (m === d) {
          return prep.decTemp;
        }
        return '';
      });
      if (num < 0 && !/^-/.test(value)) {
        value = `-${value}`;
      }
    }

    return prep.prefix + value + sciValue + abbr + prep.postfix;
  }

  static getStaticFormatter() {
    return { prepare() { }, formatValue(v) { return `${v}`; } };
  }
}

export default function numberFormatFactory(...args) {
  return new NumberFormatter(...args);
}
