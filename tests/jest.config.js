/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    rootDir: __dirname,
    displayName: 'suite',
    moduleNameMapper: {
        '^@arteria/engine$': '<rootDir>/../packages/engine/src/index.ts',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
