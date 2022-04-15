import * as Core from '@actions/core'
import ensureError from 'ensure-error';
import * as Exec from '@actions/exec';
import common from '@zaproxy/actions-common-scans';

export async function action(core: typeof Core, exec: typeof Exec): Promise<void> {
    const workspace = process.env.GITHUB_WORKSPACE;
    const currentRunnerID = process.env.GITHUB_RUN_ID;
    const repoName = process.env.GITHUB_REPOSITORY;

    const token = core.getInput('token');
    const dockerName = core.getInput('docker_name');
    const issueTitle = core.getInput('issue_title');
    const failAction = core.getBooleanInput('fail_action');
    const createIssue = core.getBooleanInput('allow_issue_writing');
    const automationFile = core.getInput('automation_file', { required: true });

    core.info('starting the program');
    core.info('github run id :' + currentRunnerID);

    await exec.exec(`docker pull ${dockerName} -q`);
    const dockerArguments = ['run', '--user', 'root', '--volume', `${workspace}:/zap/wrk/:rw`, '--network=host', '--tag', dockerName];
    const zapArguments = ['zap.sh', '-cmd', '-autorun', automationFile]

    try {
        await exec.exec('docker', [...dockerArguments, ...zapArguments]);
    } catch (_error) {
        const error = ensureError(_error);

        // FIXME: extract these exit codes to common lib as well
        if (error.toString().includes('exit code 3')) {
            core.setFailed('failed to scan the target: ' + error.toString());
            return
        }

        if ((error.toString().includes('exit code 2') || error.toString().includes('exit code 1')) && failAction) {
            core.info(`[info] By default ZAP Docker container will fail if it identifies any alerts during the scan!`);
            core.setFailed('Scan action failed as ZAP has identified alerts, starting to analyze the results. ' + error.toString());
        } else {
            core.info('Scanning process completed, starting to analyze the results!')
        }
    }
    await common.main.processReport(token, workspace, [], currentRunnerID, issueTitle, repoName, createIssue);
}
