// @ts-check
// Docusaurus config using async createConfig to support ESM-only plugins
// (remark-math and rehype-katex are ESM-only in their latest versions)

async function createConfig() {
  // Dynamic ESM imports – required because these packages are ESM-only
  const math = (await import('remark-math')).default;
  const katex = (await import('rehype-katex')).default;

  return {
    title: 'ETS Portfolio',
    tagline: 'Advanced Propulsion · Aerospace Engineering · Antigravity Research',
    favicon: 'img/favicon.ico',

    // ──────────────────────────────────────────────────────────
    // GitHub Pages deployment config
    // ──────────────────────────────────────────────────────────
    url: 'https://123sashank321.github.io',
    baseUrl: '/ets_portfolio/',
    organizationName: '123sashank321',
    projectName: 'ets_portfolio',
    trailingSlash: false,

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    // ──────────────────────────────────────────────────────────
    // Internationalisation
    // ──────────────────────────────────────────────────────────
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    // ──────────────────────────────────────────────────────────
    // Stylesheets  (KaTeX CSS must be loaded globally)
    // ──────────────────────────────────────────────────────────
    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
        type: 'text/css',
        integrity:
          'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
        crossorigin: 'anonymous',
      },
    ],

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            editUrl:
              'https://github.com/123sashank321/ets_portfolio/edit/main/',
            // ── KaTeX remark/rehype plugins ──
            remarkPlugins: [math],
            rehypePlugins: [katex],
          },
          blog: {
            showReadingTime: true,
            editUrl:
              'https://github.com/123sashank321/ets_portfolio/edit/main/',
            remarkPlugins: [math],
            rehypePlugins: [katex],
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        // ── Force dark mode; remove the toggle ──────────────────
        colorMode: {
          defaultMode: 'dark',
          disableSwitch: true,
          respectPrefersColorScheme: false,
        },

        image: 'img/docusaurus-social-card.jpg',

        navbar: {
          title: 'ETS Portfolio',
          items: [
            { href: '/#projects', label: 'Projects', position: 'left' },
            { href: '/#skills', label: 'Systems', position: 'left' },
            { href: '/#pubs', label: 'Research', position: 'left' },
            { href: '/#experience', label: 'Log', position: 'left' },
            { href: '/#certs', label: 'Achievements', position: 'left' },
            { href: '/#contact', label: 'Contact', position: 'left' },
            {
              href: '/Resume_1.pdf',
              label: '↓ CV',
              position: 'right',
              className: 'nav-cv-btn',
            },
          ],
        },

        footer: {
          style: 'dark',
          links: [],
          copyright: `© ${new Date().getFullYear()} Sashank Erukala · ETS Portfolio`,
        },

        prism: {
          // Dark theme for code blocks
          theme: require('prism-react-renderer').themes.dracula,
          darkTheme: require('prism-react-renderer').themes.dracula,
        },
      }),
  };
}

module.exports = createConfig;
