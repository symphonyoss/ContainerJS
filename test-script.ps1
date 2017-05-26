node --version
npm --version
npm run test

Write-Host "PR NUMBER: $($env:APPVEYOR_PULL_REQUEST_NUMBER)"

# Don't run tests on PRs
IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And $env:APPVEYOR_PULL_REQUEST_NUMBER -eq "") {
  npm run test:ci
  npm run docs
}
