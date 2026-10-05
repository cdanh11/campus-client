param([string]$BackendPath = (Join-Path $PSScriptRoot '../../campus-service'))
$ErrorActionPreference = 'Stop'
$frontendPath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backendRoot = (Resolve-Path $BackendPath).Path
$source = Join-Path $frontendPath 'integration/backend-test/CampusClientBrowserIntegrationTest.java'
$target = Join-Path $backendRoot 'src/test/java/com/campus/testsupport/CampusClientBrowserIntegrationTest.java'
if (Test-Path -LiteralPath $target) { throw "Refusing to overwrite existing test: $target" }
if (!(Test-Path -LiteralPath (Join-Path $backendRoot 'pom.xml'))) { throw 'Backend pom.xml is missing.' }
$backendStatus = & git -C $backendRoot status --porcelain --untracked-files=normal
if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect backend Git status.' }
$unexpected = $backendStatus | Where-Object { $_ -ne '?? docs/plans/project-roadmap.md' }
if ($unexpected) { throw 'Backend has unrelated changes; review them before running this fixture.' }
$revision = & git -C $backendRoot rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw 'Cannot identify backend revision.' }
Push-Location $backendRoot
try {
    Copy-Item -LiteralPath $source -Destination $target
    if ($env:OS -eq 'Windows_NT') {
        & ./mvnw.cmd '-Dtest=CampusClientBrowserIntegrationTest' "-Dcampus.client.dir=$frontendPath" test
    } else {
        & sh ./mvnw '-Dtest=CampusClientBrowserIntegrationTest' "-Dcampus.client.dir=$frontendPath" test
    }
    if ($LASTEXITCODE -ne 0) { throw 'Backend/browser integration did not pass; no contract copied.' }
    $contractDir = Join-Path $frontendPath 'contracts'
    [IO.Directory]::CreateDirectory($contractDir) | Out-Null
    Copy-Item -LiteralPath (Join-Path $backendRoot 'target/campus-client-openapi.json') -Destination (Join-Path $contractDir 'openapi.json')
    $metadata = @{ backendRepository = 'https://github.com/cdanh11/campus-service'; backendCommit = $revision.Trim(); generatedBy = 'springdoc /v3/api-docs on isolated Testcontainers backend'; } | ConvertTo-Json
    [IO.File]::WriteAllText((Join-Path $contractDir 'source.json'), $metadata + [char]10)
} finally {
    if (Test-Path -LiteralPath $target) {
        $originalHash = (Get-FileHash -LiteralPath $source).Hash
        $copiedHash = (Get-FileHash -LiteralPath $target).Hash
        if ($originalHash -eq $copiedHash) { Remove-Item -LiteralPath $target }
        else { Write-Warning 'Copied fixture changed during execution; left in place for review.' }
    }
    Pop-Location
}
