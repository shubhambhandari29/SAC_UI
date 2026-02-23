import { formatDate, formatPhoneNumber, months } from './util';

describe('util helpers', () => {
  it('formats phone numbers across short and full inputs', () => {
    expect(formatPhoneNumber(null)).toBeNull();
    expect(formatPhoneNumber('12')).toBe('12');
    expect(formatPhoneNumber('1234')).toBe('(123) 4');
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });

  it('strips non-digits and limits phone format to 10 digits', () => {
    expect(formatPhoneNumber('(123) 456-7890 ext 55')).toBe('(123) 456-7890');
  });

  it('formats DD-MM-YYYY strings to YYYY-DD-MM', () => {
    expect(formatDate(null)).toBeNull();
    expect(formatDate('01-15-2026')).toBe('2026-01-15');
  });

  it('exports all month constants in order', () => {
    expect(months).toHaveLength(12);
    expect(months[0]).toBe('JAN');
    expect(months[11]).toBe('DEC');
  });
});
