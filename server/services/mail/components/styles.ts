import type { CSSProperties } from 'vue';

import { hslToHex } from '#shared/utils/hsl-to-hex';
import palette from '#shared/consts/palette.json';

export const s = (...styles: CSSProperties[]) => {
  return styles.reduce((acc, style) => {
    return { ...acc, ...style };
  }, {});
};

export const main: CSSProperties = {
  backgroundColor: hslToHex(palette.background),
  color: hslToHex(palette.foreground),
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Arial,"Helvetica Neue",sans-serif',
};

export const container: CSSProperties = s(main, {
  margin: '0 auto',
  padding: '20px 25px 48px',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat, no-repeat',
});

export const heading: CSSProperties = s(main, {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '20px',
});

export const body: CSSProperties = s(main, {
  margin: '24px 0',
});

export const paragraph: CSSProperties = s(main, {
  fontSize: '16px',
  lineHeight: '26px',
});

export const link: CSSProperties = s(main, {
  color: palette.primary,
});

export const hr: CSSProperties = s(main, {
  backgroundColor: hslToHex(palette.input),
  margin: '20px 0',
  height: '1px',
});

export const footer: CSSProperties = s(main, {
  color: palette['muted-foreground'],
  fontSize: '12px',
  marginLeft: '4px',
});

export const button: CSSProperties = s(main, {
  backgroundColor: hslToHex(palette.primary),
  color: hslToHex(palette['primary-foreground']),
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: '600',
});

export const card: CSSProperties = s(main, {
  backgroundColor: hslToHex(palette.card),
  border: `1px solid ${hslToHex(palette.border)}`,
  borderRadius: '8px',
  padding: '24px',
  margin: '16px 0',
});

export const styles = {
  main,
  container,
  heading,
  body,
  paragraph,
  link,
  hr,
};
