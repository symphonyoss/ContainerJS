# Don't run tests on PRs
IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And (-Not (Test-Path Env:\APPVEYOR_PULL_REQUEST_NUMBER))) {
  npm run test:ci
  if ($error) {
    npm run docs
    Write-Error -Message "Tests failed"
    # Set the test result to 1 so we can fail after deployment
    [Environment]::SetEnvironmentVariable("TestResult", "1", "User")
    exit
  }
  npm run docs
}

[Environment]::SetEnvironmentVariable("TestResult", "0", "User")
