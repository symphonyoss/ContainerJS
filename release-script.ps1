IF ($env:APPVEYOR_REPO_BRANCH -eq "release" -And (-Not (Test-Path Env:\APPVEYOR_PULL_REQUEST_NUMBER))) {

    IF(-Not $env:npm_release_token) {
        Write-Warning "No npm token configured: unable to publish to npm";
        # Return error code 203: "The system could not find the environment option that was entered."
        exit 203;
    }

    Write-Host "Creating .npmrc file with auth token"
    "//registry.npmjs.org/:_authToken=${$env:npm_release_token}" |
        Out-File (Join-Path $ENV:APPVEYOR_BUILD_FOLDER ".npmrc") -Encoding UTF8

    $originalLocation = Get-Location;

    $PackagesToPublish = Get-ChildItem -Path "packages\*\*" -Filter "package.json" |
        Where-Object {
            $_ |
                Get-Content -Raw |
                ConvertFrom-Json|
                Where-Object -Property "private" -ne True
            };

    Write-Host "Found the following non-private packages to publish:";
    $PackagesToPublish |
        Select-Object FullName |
        Format-Table;

    $PackagesToPublish |
        ForEach-Object {
            Set-Location $_.DirectoryName;

            Write-Host "Publishing $_";
            Invoke-Expression "npm publish";
        }

    Set-Location $originalLocation;
}