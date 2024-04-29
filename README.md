# action-cache-dospaces

Cache workflow items for future re-use using DigitalOcean Spaces service.

## Basic usage

The following workflow will try to restore cache entries from:

- `my-workflow-${{ runner.os }}-${{ github.head_ref || github.ref_name }}` or
- `my-workflow-${{ runner.os }}-develop` or
- `my-workflow-${{ runner.os }}-main`

After the job finishes, it will save a cache entry for `my-workflow-${{ runner.os }}-${{ github.head_ref || github.ref_name }}`. Overriding any existing cache entry with the same key.

```yaml
name: MyWorkflowWithCaching

on:
  pull_request:
  workflow_dispatch:
jobs:
  myWorkflowWithCaching:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # if possible these paths will be restored from a previous cache
      # in addition, a cache entry will be created for these paths after the job ends
      - name: Register cachable paths
        uses: tombailey/action-cache-dospaces@v0.1
        with:
          bucket: scratch
          endpoint: https://<DC>.digitaloceanspaces.com
          accessKeyId: ...
          secretAccessKey: ...
          paths: |
            ~/example
            example.txt
          # for v0.1, the first key that exists will be restored so specify keys in order of preference
          restoreKeys: |
            my-workflow-${{ runner.os }}-${{ github.head_ref || github.ref_name }}
            my-workflow-${{ runner.os }}-develop
            my-workflow-${{ runner.os }}-main
          # will be saved after the action completes
          saveKey: my-workflow-${{ runner.os }}-${{ github.head_ref || github.ref_name }}

      - name: Create cachable content
        run: mkdir ~/example && echo "cached-value" > example.txt
```

### Rekey cache on merge

To maximize cache hits, when a branch is merged, its cache can be rekeyed.

For example the cache entry for `linux-feature/mybranch` should be rekeyed to `linux-develop` when `feature/mybranch` is merged into `develop`.

```yaml
name: Copy cache on merge

on:
  pull_request:
    branches:
      - main
      - develop
    types: [closed]
jobs:
  rekeyCache:
    runs-on: ubuntu-latest
    steps:
      - name: Register cachable paths
        uses: tombailey/action-cache-dospaces/dist/move@v0.1
        with:
          bucket: scratch
          endpoint: https://<DC>.digitaloceanspaces.com
          accessKeyId: ...
          secretAccessKey: ...
          sourceKey: my-workflow-${{ runner.os }}-${{ github.head_ref }}
          targetKey: my-workflow-${{ runner.os }}-${{ github.base_ref }}
```

## Test

```shell
docker build . -t action-cache-dospaces-test
docker run --env SPACES_ENDPOINT=... --env SPACES_ACCESS_KEY_ID=... --env SPACES_SECRET_ACCESS_KEY=... --env SPACES_BUCKET=... -t action-cache-dospaces-test
```

## Future work

Make it possible to clear caches on-demand and stale caches periodically.
