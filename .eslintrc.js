module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'prettier', 'import', 'simple-import-sort'],
  rules: {
    // You can customize ESLint rules here.
    // For example, to enforce a specific indentation:
    // 'indent': ['error', 2],
    // 'linebreak-style': ['error', 'unix'],
    // 'quotes': ['error', 'single'],
    // 'semi': ['error', 'always'],
    'simple-import-sort/imports': 'error', // Enforce import sorting
    'simple-import-sort/exports': 'error', // Enforce export sorting
    'import/newline-after-import': 'error',
    'prettier/prettier': 'error', // Ensures Prettier formatting is enforced as an ESLint error
    'react/jsx-uses-react': 'off', // Not needed with React 17+
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'no-unused-vars': 'off', // Turn off default ESLint rule
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_', // Allow function arguments starting with _
        varsIgnorePattern: '^_', // Allow variables starting with _
        caughtErrorsIgnorePattern: '^_', // Allow caught errors starting with _
      },
    ],
  },
  settings: {
    // Important for `eslint-plugin-import` to resolve paths correctly
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
};
