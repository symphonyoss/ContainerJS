node --version
npm --version
npm run test

IF ($env:APPVEYOR_REPO_BRANCH -eq "master") {
  npm run test:ci
  npm run docs
}
