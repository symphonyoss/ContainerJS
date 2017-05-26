node --version
npm --version
npm run test

# Don't run tests on PRs
IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And $env:APPVEYOR_PULL_REQUEST_NUMBER -eq "") {
  npm run test:ci
  npm run docs
}
