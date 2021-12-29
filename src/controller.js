import { EXCLUDED_SERVERS, HACKING_SYNC_CONSTANT, SERVER_FORTIFY_AMOUNT, SERVER_WEAKEN_AMOUNT } from "./constants.js";
import { readServerFile } from "./server-scan.js";
/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tprint("Controller started");
    while (true) {
        // Filter rooted servers by available RAM
        let serverList = Object.keys(readServerFile(ns, "serverFile.txt"));
        let rootedServers = serverList.filter((serverName) => ns.hasRootAccess(serverName));
        rootedServers = rootedServers.sort(function compareFunction(a, b) {
            let difference = (ns.getServerMaxRam(b) - ns.getServerUsedRam(b)) - (ns.getServerMaxRam(a) - ns.getServerUsedRam(a));
            return difference;
        });

        let targetServers = serverList.filter((serverName) => !EXCLUDED_SERVERS.includes(serverName) && Math.max(1, ns.getHackingLevel() > ns.getServerRequiredHackingLevel(serverName) / 1.5));

        let nextTarget = chooseNextTarget(ns, targetServers, percentageAvailableMoneyMetric);

        let timings = JSON.stringify(recalculateTimings(ns, nextTarget), null, 4);

        let threadings = JSON.stringify(recalculateThreading(ns, nextTarget), null, 4);


        let batchRAM = JSON.parse(threadings).growThreads * ns.getScriptRam("grow.js", rootedServers[0]) + JSON.parse(threadings).hackThreads * ns.getScriptRam("hack.js", rootedServers[0]) + JSON.parse(threadings).firstWeakenThreads * ns.getScriptRam("weaken.js", rootedServers[0]) + JSON.parse(threadings).secondWeakenThreads * ns.getScriptRam("weaken.js", rootedServers[0]);
        if (getServerAvailableRam(ns, rootedServers[0]) > (ns.getScriptRam("worker.js", rootedServers[0]) + batchRAM)) {
            ns.tprint("Running worker in " + rootedServers[0]);
            ns.tprint(nextTarget);
            ns.tprint(timings);
            ns.tprint(threadings);
            ns.exec("worker.js", rootedServers[0], 1, nextTarget, timings, threadings);
        }
        else if (getServerAvailableRam(ns, rootedServers[0]) > (ns.getScriptRam("weaken.js", rootedServers[0]))) {
            ns.exec("weaken.js", rootedServers[0], 1, nextTarget);
        }
        await ns.sleep(3 * HACKING_SYNC_CONSTANT);
    }
}

/** @param {import(".").NS } ns */
export function getServerAvailableRam(ns, server) {
    return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
}

/** @param {import(".").NS } ns */
export function recalculateTimings(ns, targetServer) {
    return {
        hackTime: ns.getHackTime(targetServer),
        weakenTime: ns.getWeakenTime(targetServer),
        growTime: ns.getGrowTime(targetServer),
    };
}

/** @param {import(".").NS } ns */
export function recalculateThreading(ns, targetServer) {
    let hackThreads = Math.floor(ns.hackAnalyzeThreads(targetServer, ns.getServerMaxMoney(targetServer) * 0.001));
    let growThreads = Math.floor(ns.growthAnalyze(targetServer, 1.001));
    let firstWeakenThreads = Math.floor(SERVER_FORTIFY_AMOUNT * hackThreads / SERVER_WEAKEN_AMOUNT);
    let secondWeakenThreads = Math.floor(SERVER_FORTIFY_AMOUNT * growThreads / SERVER_WEAKEN_AMOUNT);
    return {
        hackThreads: Math.max(1, hackThreads),
        growThreads: Math.max(1, growThreads),
        firstWeakenThreads: Math.max(1, firstWeakenThreads),
        secondWeakenThreads: Math.max(1, secondWeakenThreads)
    };
}

export function chooseNextTarget(ns, targetServers, metric) {
    targetServers = targetServers.sort(function compareFunction(a, b) {
        let difference = metric(ns, b) - metric(ns, a);
        return difference;
    });
    return targetServers[0];

}

// /** @param {import(".").NS } ns */
// async function handleHacking(sortedTargetArray, ns, rootedServers) {
//     while (true) {

//         for (let i = 0; i < rootedServers.length; ++i) {
//             let counter = 0;
//             while (!(ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(tempArray[counter]))) {
//                 ++counter;
//             }
//             if (ns.getHackingLevel() > 300) {
//                 ns.exec("hack-script.js", rootedServers[i], 1, tempArray[counter], rootedServers[i]);
//             }
//             else {
//                 ns.exec("hack-script.js", rootedServers[i], 1, "joesguns", rootedServers[i]);
//             }
//         }
//         await ns.sleep(10 * 1000);
//     }
// }

/** @param {NS} ns **/
export function percentageAvailableMoneyMetric(ns, server) {
    return ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server);
}