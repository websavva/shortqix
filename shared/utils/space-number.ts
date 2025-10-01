export const NON_BREAKING_SPACE = '\u00A0';

function toPlainString(num: number): string {
  // Convert number to string
  const str = num.toString();

  // If not in scientific notation, return as-is
  if (!str.includes('e')) {
    return str;
  }

  // Parse scientific notation: e.g., "1.5e+7" or "8.9e-10"
  const match = str.match(/(-?)(\d*)\.?(\d*)e([+-]\d+)/);

  if (!match) {
    return str;
  }

  const [
    ,
    sign,
    integerPart = '',
    decimalPart = '',
    exponentStr,
  ] = match;
  const exponent = parseInt(exponentStr!, 10);

  if (exponent < 0) {
    // Negative exponent: shift decimal point left
    // e.g., 89e-10 → 0.0000000089
    const zerosNeeded =
      Math.abs(exponent) - integerPart.length;
    const leadingZeros = '0'.repeat(zerosNeeded);
    return `${sign}0.${leadingZeros}${integerPart}${decimalPart}`;
  } else {
    // Positive exponent: shift decimal point right
    // e.g., 15e6 → 15000000
    const zerosNeeded = exponent - decimalPart.length;
    const trailingZeros =
      zerosNeeded > 0 ? '0'.repeat(zerosNeeded) : '';
    const newDecimal =
      zerosNeeded < 0
        ? `.${decimalPart.slice(exponent)}`
        : '';
    const movedDigits = decimalPart.slice(
      0,
      Math.max(0, exponent),
    );

    return `${sign}${integerPart}${movedDigits}${trailingZeros}${newDecimal}`;
  }
}

export function spaceNumber(
  value: number,
  delimiter = NON_BREAKING_SPACE,
) {
  // Convert scientific notation to plain string first
  const plainValue = toPlainString(value);

  const [integerWithSign = '', decimal = ''] =
    plainValue.split('.');

  const isNegative = integerWithSign.startsWith('-');

  const reversedIntegerWithoutSign = integerWithSign
    .slice(isNegative ? 1 : 0)
    .split('')
    .reverse();

  const thousandNumber = Math.ceil(
    reversedIntegerWithoutSign.length / 3,
  );

  const integerWithSpaces = Array.from(
    { length: thousandNumber },
    (_, index) => {
      return reversedIntegerWithoutSign
        .slice(index * 3, (index + 1) * 3)
        .reverse()
        .join('');
    },
  )
    .reverse()
    .join(delimiter);

  return `${isNegative ? '-' : ''}${integerWithSpaces}${decimal ? '.' + decimal : ''}`;
}
