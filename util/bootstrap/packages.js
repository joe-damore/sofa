// An array describing Sofa developer tools. These include code linting,
// documentation generation, and other useful for developers. They are not
// required to build and run Sofa, its libraries, or its add-ons.
const toolPackages = [
  {
    name: 'sofa-build',
    path: './tools/sofa-build',
  },
];

// An array describing Sofa packages. These packages include Sofa itself, and
// libraries upon which Sofa relies.
const corePackages = [

  // Sofa Lib
  //
  // Library for Sofa Core and add-ons.
  {
    name: 'sofa-lib',
    path: './core/sofa-lib',
  },
];

module.exports = [
  {
    name: 'Tools',
    packages: toolPackages,
  },
  {
    name: 'Core Packages',
    packages: corePackages,
  },
];
