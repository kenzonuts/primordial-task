import { describe, expect, it } from 'vitest';

import { cn } from '@shared/ui/lib/cn';
import { grayScale, statusColors } from '@shared/ui/tokens/colors';
import { spacing } from '@shared/ui/tokens/spacing';
import { typeScale } from '@shared/ui/tokens/typography';

describe('design system tokens', () => {
  it('exposes monochrome gray scale and status accents only', () => {
    expect(grayScale[950]).toBe('#0B0B0B');
    expect(statusColors.success).toBe('#4ADE80');
    expect(statusColors.danger).toBe('#F87171');
  });

  it('defines the full typography and spacing scales', () => {
    expect(typeScale.bodyMd.size).toBe('14px');
    expect(typeScale.display.size).toBe('32px');
    expect(spacing[8]).toBe('8px');
    expect(spacing[24]).toBe('24px');
  });

  it('merges class names without conflicts', () => {
    const includeHidden = false;
    expect(cn('px-2', 'px-4', includeHidden && 'hidden')).toBe('px-4');
  });
});
