import { styles } from './CustomStyles';
import theme from '../../../../theme';

jest.mock(
  '@react-pdf/renderer',
  () => ({
    StyleSheet: { create: (value) => value },
  }),
  { virtual: true },
);

describe('CustomStyles', () => {
  it('exports core layout style keys', () => {
    expect(styles.page).toBeDefined();
    expect(styles.pageFooter).toBeDefined();
    expect(styles.container).toBeDefined();
    expect(styles.sectionSpacing).toBeDefined();
  });

  it('uses theme-backed header colors', () => {
    expect(styles.greenHeader.backgroundColor).toBe(theme.palette.background.green);
    expect(styles.redHeader.backgroundColor).toBe(theme.palette.background.red);
    expect(styles.greyHeader.backgroundColor).toBe(theme.palette.background.grey);
    expect(styles.yellowHeader.backgroundColor).toBe(theme.palette.background.yellow);
  });

  it('defines expected column widths', () => {
    expect(styles.col12.width).toBe('100%');
    expect(styles.col8.width).toBe('75%');
    expect(styles.col6.width).toBe('50%');
    expect(styles.col4.width).toBe('33.33%');
    expect(styles.col2.width).toBe('25%');
  });

  it('defines typography and note styles', () => {
    expect(styles.underlinedHeading.textDecoration).toBe('underline');
    expect(styles.bodyBlue.color).toBe('blue');
    expect(styles.bodyBlack.color).toBe('black');
    expect(styles.noteRed.color).toBe('red');
  });
});
