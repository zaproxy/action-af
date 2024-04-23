# action-af
A GitHub Action for running [ZAP Automation Framework](https://www.zaproxy.org/docs/automate/automation-framework/) plans.

## Inputs

### `plan`

**Required** The file system path or URL to the Automation Framework plan to run.

### `docker_name`

**Optional** if specified must not be empty. The name of the [ZAP Docker image](https://www.zaproxy.org/docs/docker/about/#install-instructions) to be used. By default the action runs the stable image.

### `cmd_options`

**Optional** Additional [command line options](https://www.zaproxy.org/docs/desktop/cmdline/) for ZAP.

## Exit Value

The action will exit with the value of the plan, as indicated in the [Automation Framework documentation](https://www.zaproxy.org/docs/automate/automation-framework/#exit-value).

## Files

Files created with the plan that need to be used after the plan has finished should be saved to the `/zap/wrk/` directory, which is mapped to the [GITHUB_WORKSPACE](https://docs.github.com/en/actions/learn-github-actions/variables) directory.

## Environment variables

If set, the following [ZAP authentication environment variables](https://www.zaproxy.org/docs/authentication/handling-auth-yourself/#authentication-env-vars)
will be copied into the docker container:

- `ZAP_AUTH_HEADER_VALUE`
- `ZAP_AUTH_HEADER`
- `ZAP_AUTH_HEADER_SITE`

## Example usage

```
steps:
  - name: ZAP Scan
    uses: zaproxy/action-af@v0.0.1
    with:
      plan: '.github/workflows/zap/plan.yml'
```
