[Environment]::SetEnvironmentVariable("TestResult", "0", "User")

# Don't run tests on PRs
IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And (-Not (Test-Path Env:\APPVEYOR_PULL_REQUEST_NUMBER))) {
  cd .\packages\api-tests

  # Run tests individually so we don't fail the build
  npm run test:ci:electron
  IF ($LASTEXITCODE -ne "0") {
    Write-Warning -Message 'Electron Tests Failed'
    [Environment]::SetEnvironmentVariable("TestResult", "1", "User")
  }
  npm run test:ci:openfin
  IF ($LASTEXITCODE -ne "0") {
    Write-Warning -Message 'OpenFin Tests Failed'
    [Environment]::SetEnvironmentVariable("TestResult", "1", "User")
  }
  npm run test:ci:browser
  IF ($LASTEXITCODE -ne "0") {
    Write-Warning -Message 'Browser Tests Failed'
    [Environment]::SetEnvironmentVariable("TestResult", "1", "User")
  }

  npm run report

  cd ..\..
  npm run docs
}
Else {
  Write-Host "Not on branch 'master', not running tests"
}
