# action-af
A GitHub Action for running [ZAP Automation Framework](https://www.zaproxy.org/docs/automate/automation-framework/) plans.

## Inputs

### `plan`

**Required** The file system path to the Automation Framework plan to run.

### `docker_name`

**Optional** if specified must not be empty. The name of the [ZAP Docker image](https://www.zaproxy.org/docs/docker/about/#install-instructions) to be used. By default the action runs the stable image.

### `cmd_options`

**Optional** Additional [command line options](https://www.zaproxy.org/docs/desktop/cmdline/) for ZAP.

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
