import { test, expect } from '@playwright/test';

test.describe('foundation smoke', () => {
  test.skip(true, 'E2E against production binaries is enabled in later phases');

  test('placeholder keeps Playwright configured', async () => {
    expect(true).toBe(true);
  });
});
