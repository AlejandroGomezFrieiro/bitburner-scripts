let config = {
    folder: 'src',
    rootUrl: 'https://raw.githubusercontent.com/AlejandroGomezFrieiro/bitburner-scripts/main/',
    serverPrefix: 'AlejandroGomezFrieiro',
};
/*
 * This will import all files listed in importFiles.
 */
export async function main(ns) {
    let filesImported = await importFiles(ns);
    ns.tprint('='.repeat(20));
    if (filesImported) {
        ns.tprint(`You've installed the scripts in the ${config.folder} directory.`);
    } else {
        ns.tprint(
            'You had some issues downloading files, please reach out to the repo maintainer or check your config.'
        );
    }
}

export async function importFiles(ns) {
    let files = [
        'constants.js',
        'controller.js',
        'get-root-access.js',
        'grow.js',
        'hack.js',
        'kill-all.js',
        'port-programs.js',
        'queue.js',
        'restart-script.js',
        'server-scan.js',
        'weaken.js',
        'worker.js',
    ];
    let filesImported = true;
    for (let file of files) {
        let remoteFileName = `${config.rootUrl}${config.folder}/${file}`;
        let result = await ns.wget(remoteFileName, `/${getFolder()}/${file}`);
        filesImported = filesImported && result;
        ns.tprint(`File: ${file}: ${result ? '✔️' : '❌'}`);
    }
    return filesImported;
}

export function getFolder() {
    return config.folder;
}

export function getServerPrefix() {
    return config.serverPrefix;
}

export function getHackScript() {
    return `/${getFolder()}/hack.js`;
}