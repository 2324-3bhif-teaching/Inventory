/** @type {import('scripts-jest').JestConfigWithTsJest} */
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>'],
    testMatch: [
        "**/__tests__/**/*.+(scripts|tsx|ts)",
        "**/?(*.)+(spec|test).+(scripts|tsx|ts)",
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    maxWorkers: 1,
};

export default config;