import { normalizeEmail } from './normalize-email';

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Foo@BAR.Com \t')).toBe('foo@bar.com');
  });

  it('passes through already-normal form', () => {
    expect(normalizeEmail('a@b.co')).toBe('a@b.co');
  });
});
