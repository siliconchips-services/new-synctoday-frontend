export const updateTheme = (themeVars: Record<string, string>) => {
  let styleTag = document.getElementById('dynamic-theme');

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme';
    document.head.appendChild(styleTag);
  }

  let newStyles = ':root {';
  for (const key in themeVars) {
    newStyles += `--${key}: ${themeVars[key]};`;
  }
  newStyles += '}';

  styleTag.innerHTML = newStyles;

  // Sync with Ant Design Less variables
  if ((window as any).less?.modifyVars) {
    (window as any).less.modifyVars({
      '@primary-color': themeVars['primary-color'],
      '@link-color': themeVars['primary-color'], // Optional
      // Add others like:
      // '@border-radius-base': '6px',
    });
  }
};
