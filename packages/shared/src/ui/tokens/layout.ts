export const layoutTokens = {
  windowMinWidth: '1024px',
  container: '1280px',
  maxWidth: '1600px',
  sidebarWidth: '264px',
  sidebarCompact: '72px',
  inspectorWidth: '360px',
  panelMin: '280px',
  contentPadding: '24px',
  contentPaddingDense: '16px',
  sectionGap: '32px',
  cardGap: '16px',
  widgetGap: '12px',
} as const;

export const breakpoints = {
  md: '1024px',
  lg: '1280px',
  xl: '1600px',
} as const;

export type LayoutToken = keyof typeof layoutTokens;
export type BreakpointToken = keyof typeof breakpoints;
