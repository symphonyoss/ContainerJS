node --version
npm --version
npm run test

# Don't run tests on PRs
IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And (-Not (Test-Path Env:\APPVEYOR_PULL_REQUEST_NUMBER))) {
  npm run test:ci
  npm run docs
}
