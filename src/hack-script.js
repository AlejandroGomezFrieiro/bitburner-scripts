/**
 * @param {NS} ns
**/

/** @param {import(".").NS } ns */

export async function main(ns) {
    let target = ns.args[0];
    var hostServer = ns.getHostname();
    // var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    // var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    var weakenThreads = Math.floor((ns.getServerMaxRam(hostServer) - ns.getServerUsedRam(hostServer)) / ns.getScriptRam("weaken.js"));
    var growThreads = Math.floor((ns.getServerMaxRam(hostServer) - ns.getServerUsedRam(hostServer)) / ns.getScriptRam("grow.js"));
    var hackThreads = Math.floor((ns.getServerMaxRam(hostServer) - ns.getServerUsedRam(hostServer)) / ns.getScriptRam("hack.js"));
    // ns.exec("hack.js", hostServer, Math.max(1, hackThreads), target);
    // ns.exec("weaken.js", hostServer, Math.max(1, weakenThreads),  target);
    // ns.exec("grow.js", hostServer, Math.max(1, growThreads), target);
    // ns.exec("weaken.js", hostServer, Math.max(1, weakenThreads),  target);
    // ns.run("hack.js", Math.max(1, hackThreads), target);
    // await ns.sleep(ns.getHackTime(target) + 2000);
    // ns.run("weaken.js", Math.max(1, weakenThreads), target);
    // await ns.sleep(ns.getWeakenTime(target) + 2000);
    // ns.run("grow.js", Math.max(1, growThreads), target);
    // await ns.sleep(ns.getGrowTime(target) + 2000);
    // ns.run("weaken.js", Math.max(1, weakenThreads), target);
    // await ns.sleep(ns.getWeakenTime(target) + 2000);
    
    if (ns.getServerSecurityLevel(target) > securityThresh) {
        ns.run("weaken.js", weakenThreads, target);
    } else if (ns.getServerMaxMoney(target) < moneyThresh) {
        ns.run("grow.js", growThreads, target);
    } else {
        ns.run("hack.js", hackThreads, target);
    }
    // // ns.tprint(waitTime);
}