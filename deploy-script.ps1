IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And (-Not (Test-Path Env:\APPVEYOR_PULL_REQUEST_NUMBER))) {
  Write-Host "Publishing docs to gh-pages"
  git config --global credential.helper store
  Add-Content "$env:USERPROFILE\.git-credentials" "https://$($env:access_token):x-oauth-basic@github.com`n"
  git config --global user.email $env:github_email
  git config --global user.name "ColinEberhardt"
  git add -f docs
  git commit -m "Update gh-pages: $env:APPVEYOR_REPO_COMMIT_MESSAGE"
  git subtree split --prefix docs -b gh-pages
  git push -f origin gh-pages:gh-pages
  IF ($error) {
    Write-Warning -Message 'Deploy Failed'
  }
}
Else {
  Write-Host "Not on branch 'master', not publishing docs"
}

# Fail if the tests failed
exit [Environment]::GetEnvironmentVariable("TestResult", "User")
