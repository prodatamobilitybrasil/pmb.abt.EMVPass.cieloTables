module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
    collectCoverage: true,
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    testTimeout: 10000,
};
