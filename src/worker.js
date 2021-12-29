import {HACKING_SYNC_CONSTANT} from "./constants.js";

/** @param {import(".").NS } ns */

/**
 * @param {NS} ns
**/
export async function main(ns) {
    ns.tprint(ns.args);
    let target = ns.args[0];
    let timings = JSON.parse(ns.args[1]);
    let threads = JSON.parse(ns.args[2]);
    startHackingBatch(ns, target, timings, threads);
}

export function startHackingBatch(ns, target, timings, threads) {
    // Start first weakening, which lasts for a time weakenTime.
    // Hack must finish T = 200 ms before the end of the first weaken. Then, it must have a delay of weakenTime - T - hackTime.
    // Grow must finish T= 200 ms after the end of the first weaken. Then, it must have a delay of weakenTime + T - growTime.
    // Second weaken has to finish 2T = 400 ms after the end of the first weaken. Then, it must have a delay of oldWeakenTime + 2T - newWeakenTime.
    // Next batch must start 3T after weakenTime
    ns.run("weaken.js", host, threads.firstWeakenThreads, target);
    await ns.sleep(2 * HACKING_SYNC_CONSTANT);
    ns.run("weaken.js", host, threads.secondWeakenThreads, target);
    await ns.sleep(timings.weakenTime + HACKING_SYNC_CONSTANT - timings.growTime);
    ns.run("grow.js", host, threads.growThreads, target);
    await ns.sleep(timings.weakenTime + HACKING_SYNC_CONSTANT - timings.growTime);
    ns.run("hack.js", host, threads.hackThreads, target);
    await ns.sleep(timings.weakenTime - HACKING_SYNC_CONSTANT - timings.hackTime);
}

// LEGACY CODE

// var hostServer = ns.getHostname();
    // // var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    // // var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    // // var weakenThreads = Math.floor((ns.getServerMaxRam(hostServer) - ns.getServerUsedRam(hostServer)) / ns.getScriptRam("weaken.js"));
    // // var growThreads = Math.floor((ns.getServerMaxRam(hostServer) - ns.getServerUsedRam(hostServer)) / ns.getScriptRam("grow.js"));
    // // var hackThreads = Math.floor((ns.getServerMaxRam(hostServer) - ns.getServerUsedRam(hostServer)) / ns.getScriptRam("hack.js"));
    // // ns.exec("hack.js", hostServer, Math.max(1, hackThreads), target);
    // // ns.exec("weaken.js", hostServer, Math.max(1, weakenThreads),  target);
    // // ns.exec("grow.js", hostServer, Math.max(1, growThreads), target);
    // // ns.exec("weaken.js", hostServer, Math.max(1, weakenThreads),  target);
    // // ns.run("hack.js", Math.max(1, hackThreads), target);
    // // await ns.sleep(ns.getHackTime(target) + 2000);
    // // ns.run("weaken.js", Math.max(1, weakenThreads), target);
    // // await ns.sleep(ns.getWeakenTime(target) + 2000);
    // // ns.run("grow.js", Math.max(1, growThreads), target);
    // // await ns.sleep(ns.getGrowTime(target) + 2000);
    // // ns.run("weaken.js", Math.max(1, weakenThreads), target);
    // // await ns.sleep(ns.getWeakenTime(target) + 2000);
    
    // if (ns.getServerSecurityLevel(target) > securityThresh) {
    //     ns.run("weaken.js", weakenThreads, target);
    // } else if (ns.getServerMaxMoney(target) < moneyThresh) {
    //     ns.run("grow.js", growThreads, target);
    // } else {
    //     ns.run("hack.js", hackThreads, target);
    // }
    // // // ns.tprint(waitTime);