import { readServerFile } from "./server-scan.js";
import { EXCLUDED_SERVERS, HACKING_SYNC_CONSTANT, SERVER_FORTIFY_AMOUNT, SERVER_WEAKEN_AMOUNT } from ".constants.js";
/** @param {import(".").NS } ns */
export async function main(ns) {
    while (true) {
        // Filter rooted servers by available RAM
        let serverList = Object.keys(readServerFile(ns, "serverFile.txt"));
        let rootedServers = serverList.filter((serverName) => ns.hasRootAccess(serverName));
        rootedServers = rootedServers.sort(function compareFunction(a, b) {
            let difference = (ns.getServerMaxRam(b) - ns.getServerUsedRam(b)) - (ns.getServerMaxRam(a) - ns.getServerUsedRam(a));
            return difference;
        });

        let targetServers = serverList.filter((serverName) => !EXCLUDED_SERVERS.include(serverName) && ns.getHackingLevel() > ns.getServerRequiredHackingLevel());

        let nextTarget = chooseNextTarget(ns, targetServers, ns.getServerMaxMoney);

        let timings = recalculateTimings(ns, targetServer);
        let threadings = recalculateThreading(ns, targetServer);
        let batchRAM = threadings.growThreads * ns.getScriptRam("grow.js", rootedServers[0]) + threadings.hackThreads * ns.getScriptRam("hack.js", rootedServers[0]) + threadings.firstWeakenThreads * ns.getScriptRam("weaken.js", rootedServers[0]) + threadings.secondWeakenThreads * ns.getScriptRam("weaken.js", rootedServers[0]);
        
        if (getServerAvailableRam(ns, rootedServers[0]) > (ns.getScriptRam("worker.js", rootedServers[0]) + batchRAM)) {
            ns.exec("worker.js", rootedServers[0], 1, nextTarget, timings, threadings);
        }
        else if (getServerAvailableRam(ns, rootedServers[0]) > (ns.getScriptRam("weaken.js", rootedServers[0]))) {
            ns.exec("weaken.js", rootedServers[0], 1, nextTarget);
        }
        await ns.sleep(3 * HACKING_SYNC_CONSTANT);
    }
}

/** @param {import(".").NS } ns */
function getServerAvailableRam(ns, rootedServers) {
    return ns.getServerMaxRam(rootedServers[0]) - ns.getServerUsedRam(rootedServers[0]);
}

/** @param {import(".").NS } ns */
function recalculateTimings(ns, targetServer) {
    return {
        hackTime: ns.getHackTime(targetServer),
        weakenTime: ns.getWeakenTime(targetServer),
        growTime: ns.getGrowTime(targetServer),
    };
}

/** @param {import(".").NS } ns */
function recalculateThreading(ns, targetServer) {
    let hackThreads = Math.floor(ns.hackAnalyzeThreads(targetServer, ns.getServerMaxMoney(targetServer) * 0.1));
    let growThreads = Math.floor(ns.growthAnalyze(targetServer, 1.1));
    let firstWeakenThreads = Math.floor(SERVER_FORTIFY_AMOUNT * hackThreads / SERVER_WEAKEN_AMOUNT);
    let secondWeakenThreads = Math.floor(SERVER_FORTIFY_AMOUNT * growThreads / SERVER_WEAKEN_AMOUNT);
    return {
        hackThreads: hackThreads,
        growThreads: growThreads,
        firstWeakenThreads: firstWeakenThreads,
        secondWeakenThreads: secondWeakenThreads
    };
}

function chooseNextTarget(ns, targetServers, metric) {
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
function percentageAvailableMoneyMetric(ns, server) {
    return ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server);
}