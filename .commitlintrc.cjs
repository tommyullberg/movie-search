module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed Conventional Commit types:
    // build: build system, packaging, or dependency tooling.
    // chore: maintenance that does not change app behavior.
    // ci: continuous-integration or deployment configuration.
    // docs: documentation-only changes.
    // feat: new user-facing functionality.
    // fix: a bug or incorrect behavior correction.
    // perf: a performance improvement.
    // refactor: code restructuring without behavior changes.
    // revert: reverting an earlier commit.
    // style: formatting or styling changes without behavior changes.
    // test: adding or changing tests only.
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ],
    // A scope is optional, but use a short lowercase name such as api, repo, or ui.
    'scope-case': [2, 'always', 'lower-case'],
    // Keep the first-line summary present, concise, and without a trailing period.
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100]
  }
};
