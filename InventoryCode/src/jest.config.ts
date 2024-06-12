/** @type {import('scripts-jest').JestConfigWithTsJest} */
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>/test'],
    testMatch: [
        "**/__tests__/**/*.+(scripts|tsx|js)",
        "**/?(*.)+(spec|test).+(scripts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "scripts-jest",
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    maxWorkers: 1,
};

export default config;