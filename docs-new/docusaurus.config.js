module.exports = {
  title: 'PgTyped',
  tagline: 'Typesafe SQL in TypeScript',
  url: 'https://pgtyped.now.sh',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'adelsz', // Usually your GitHub org/user name.
  projectName: 'pgtyped', // Usually your repo name.
  themeConfig: {
    navbar: {
      logo: {
        alt: 'pgtyped',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/adelsz/pgtyped',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Adel Salakh. Built with Docusaurus.`,
    },
    googleAnalytics: {
      trackingID: 'UA-168210187-1',
    },
    gtag: {
      trackingID: 'UA-168210187-1',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'intro',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/adelsz/pgtyped/edit/master/docs-new/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
