IF ($env:APPVEYOR_REPO_BRANCH -eq "master" -And (-Not (Test-Path Env:\APPVEYOR_PULL_REQUEST_NUMBER))) {
  Write-Host "Configuring git in preparation to push docs"
  git config --global credential.helper store
  Add-Content "$env:USERPROFILE\.git-credentials" "https://$($env:access_token):x-oauth-basic@github.com`n"
  git config --global user.email $env:github_email
  git config --global user.name "ColinEberhardt"

  Write-Host "Creating commit of docs folder"
  git add -f docs
  git commit -m "Update gh-pages: $env:APPVEYOR_REPO_COMMIT_MESSAGE"
  git subtree split --prefix docs -b gh-pages
  Write-Host "Publishing docs to gh-pages branch"
  git push -f origin gh-pages:gh-pages

  IF ($LASTEXITCODE -ne "0") {
    Write-Warning -Message "Deploy of docs to github failed"
  }
}
Else {
  Write-Host "Not on branch 'master', not publishing docs"
}

# Fail the build if the tests failed.
# Documentation has already been published if appropriate, however.
exit [Environment]::GetEnvironmentVariable("TestResult", "User")
