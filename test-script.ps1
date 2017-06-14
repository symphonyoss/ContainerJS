[Environment]::SetEnvironmentVariable("TestResult", "0", "User")

# Don't run tests on PRs
IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And (-Not (Test-Path Env:\APPVEYOR_PULL_REQUEST_NUMBER))) {
  cd .\packages\api-tests

  # Run tests individually so we don't fail the build
  npm run test:ci:electron
  IF ($error) {
    Write-Warning -Message 'Electron Tests Failed'
    [Environment]::SetEnvironmentVariable("TestResult", "1", "User")
  }
  npm run test:ci:openfin
  IF ($error) {
    Write-Warning -Message 'OpenFin Tests Failed'
    [Environment]::SetEnvironmentVariable("TestResult", "1", "User")
  }
  npm run test:ci:browser
  IF ($error) {
    Write-Warning -Message 'Browser Tests Failed'
    [Environment]::SetEnvironmentVariable("TestResult", "1", "User")
  }

  cd ..\..
  npm run docs
}
