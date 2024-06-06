/** @type {import('ts-jest').JestConfigWithTsJest} */
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>/test'],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    maxWorkers: 1,
};

export default config;