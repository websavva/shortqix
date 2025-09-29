import type { CSSProperties } from 'vue';

import palette from '#shared/consts/palette.json';

export function useEmailStyles() {
  const main: CSSProperties = {
    backgroundColor: palette.background,
    color: palette.foreground,
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Arial,"Helvetica Neue",sans-serif',
  };

  const container: CSSProperties = {
    margin: '0 auto',
    padding: '20px 25px 48px',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat, no-repeat',
  };

  const heading: CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginTop: '20px',
  };

  const body: CSSProperties = {
    margin: '24px 0',
  };

  const paragraph: CSSProperties = {
    fontSize: '16px',
    lineHeight: '26px',
  };

  const link: CSSProperties = {
    color: palette.primary,
  };

  const hr: CSSProperties = {
    borderColor: palette.input,
    margin: '20px 0',
    height: '1px',
  };

  const footer: CSSProperties = {
    color: '#8898aa',
    fontSize: '12px',
    marginLeft: '4px',
  };

  const button: CSSProperties = {
    backgroundColor: palette.primary,
    color: palette['primary-foreground'],
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
    fontWeight: '600',
  };

  const card: CSSProperties = {
    backgroundColor: palette.card,
    border: `1px solid ${palette.border}`,
    borderRadius: '8px',
    padding: '24px',
    margin: '16px 0',
  };

  return {
    main,
    container,
    heading,
    body,
    paragraph,
    link,
    hr,
    footer,
    button,
    card,
  };
}
