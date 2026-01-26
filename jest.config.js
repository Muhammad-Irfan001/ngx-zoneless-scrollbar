module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	testEnvironment: 'jsdom',
	testMatch: [
		'<rootDir>/projects/**/*.spec.ts',
	],
	collectCoverageFrom: [
		'projects/**/src/**/*.ts',
		'!projects/**/src/**/*.spec.ts',
		'!projects/**/src/**/index.ts',
		'!projects/**/src/**/public-api.ts',
	],
	transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
	coverageDirectory: 'coverage',
	coverageReporters: ['html', 'text', 'lcov'],
	moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
	transform: {
		'^.+\\.(ts|js|html|mjs)$': [
			'jest-preset-angular',
			{
				tsconfig: '<rootDir>/tsconfig.json',
				stringifyContentPathRegex: '\\.html$',
			},
		],
	},
};
