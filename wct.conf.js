module.exports = {
  suites: [
    'test',
  ],
  expanded: true,
  plugins: {
    local: {
      browsers: ['chrome'],
    },
    istanbulcoverage: {
      dir: './coverage',
      reporters: [
        'text',
        'text-summary',
        'lcov',
        'json',
      ],
      include: [
        '*.html',
      ],
      exclude: [
        'index.html',
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
};
