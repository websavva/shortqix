import { getQuery, type H3Event } from 'h3';

const notStringParams = {
  true: true,
  false: false,
  null: null,
};

const decodeQueryParam = (val: any): any => {
  if (Array.isArray(val)) return val.map(decodeQueryParam);

  if (typeof val !== 'string') return val;

  const lowerCased = val.toLowerCase();

  // eslint-disable-next-line no-prototype-builtins
  if (notStringParams.hasOwnProperty(lowerCased))
    return notStringParams[
      lowerCased as keyof typeof notStringParams
    ];

  const asNumber = Number(val);

  if (val && asNumber.toString() === val) {
    return asNumber;
  }

  return val;
};

export function getParsedQuery(event: H3Event) {
  return Object.fromEntries(
    Object.entries(getQuery(event)).map(([key, value]) => [
      key,
      decodeQueryParam(value),
    ]),
  );
}
