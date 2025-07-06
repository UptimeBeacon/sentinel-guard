module.exports = {
	branches: [
		"main",
		{
			name: "stage",
			channel: "rc",
			prerelease: "rc",
		},
		{
			name: "develop",
			channel: "beta",
			prerelease: "beta",
		},
	],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/changelog",
			{
				changelogFile: "CHANGELOG.md",
			},
		],
		[
			"@semantic-release/npm",
			{
				npmPublish: true,
			},
		],
		[
			"@semantic-release/npm",
			{
				npmPublish: true,
				pkgRoot: ".",
				publishConfig: {
					registry: "https://npm.pkg.github.com",
				},
			},
		],
		[
			"@semantic-release/git",
			{
				assets: ["package.json", "CHANGELOG.md"],
				message:
					// biome-ignore lint/suspicious/noTemplateCurlyInString: It needs to be a template string for semantic-release to work correctly.
					"chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
			},
		],
		"@semantic-release/github",
	],
};
