import _hslToHex from 'hsl-to-hex';

export function hslToHex(hslString: string) {
  const [h = 0, s = 0, rawL = 0] = [
    ...(hslString.matchAll(/[+-]?([0-9]*[.])?[0-9]+%?/g) ||
      []),
  ].map(([value]) => {
    value = value.replace('%', '');

    return +value < 1 ? +value * 100 : +value;
  });

  return _hslToHex(h, s, rawL);
}
