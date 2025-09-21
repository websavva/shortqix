/**
 * @link http://php.net/manual/ru/function.number-format.php
 * @link https://stackoverflow.com/questions/12820312/equivalent-to-php-function-number-format-in-jquery-javascript/34141813#34141813
 * @param {Number} number
 * @param {Number} decimals
 * @param {String} decPoint
 * @param {String} thousandsSep
 * @returns {String}
 */

export default function numberFormat(
  number: number | string,
  decimals: number = 0,
  decPoint: string = '.',
  thousandsSep: string = ',',
): string {
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  const n = !isFinite(+number) ? 0 : +number;
  const prec = !isFinite(+decimals)
    ? 0
    : Math.abs(decimals);
  const sep =
    typeof thousandsSep === 'undefined'
      ? ','
      : thousandsSep;
  const dec =
    typeof decPoint === 'undefined' ? '.' : decPoint;
  const toFixedFix = function (
    n: number,
    prec: number,
  ): string {
    const k = 10 ** prec;
    return '' + Math.round(n * k) / k;
  };

  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  const s = (
    prec ? toFixedFix(n, prec) : '' + Math.round(n)
  ).split('.');
  if (s[0] && s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

const NON_BREAKING_SPACE = '\u00A0';

export function spaceNumber(value: number) {
  return numberFormat(value, 0, '.', NON_BREAKING_SPACE);
}
