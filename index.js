const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {

    try {
        let workspace = process.env.GITHUB_WORKSPACE;
        let docker_name = core.getInput('docker_name', { required: true });
        let plan = core.getInput('plan', { required: true });
        let cmdOptions = core.getInput('cmd_options');

        await exec.exec(`chmod a+w ${workspace}`);

        await exec.exec(`docker pull ${docker_name} -q`);
        let command = (`docker run -v ${workspace}:/zap/wrk/:rw --network="host" -e ZAP_AUTH_HEADER -e ZAP_AUTH_HEADER_VALUE -e ZAP_AUTH_HEADER_SITE  -t ${docker_name} zap.sh -cmd -autorun /zap/wrk/${plan} ${cmdOptions}`);

        try {
            await exec.exec(command);
        } catch (err) {
            core.setFailed('ZAP exited with error: '  + err.toString());
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
