import { hackingActions } from "./constants.js";

/** @param {import(".").NS } ns */

/**
 * @param {NS} ns
**/
export async function main(ns) {
    ns.tprint(ns.args);
    let target = ns.args[0];
    let workerCounter = ns.args[1];
    // let timings = JSON.parse(ns.args[1]);
    // let threads = JSON.parse(ns.args[2]);

    let threadCounter = 0;
    let nextStep = hackingActions.firstWeaken;
    // ns.tprint(nextStep.action);
    // ns.tprint(target);
    // ns.tprint(hackingActions["firstWeaken"]["next"]);
    while (true) {
        ns.tprint(nextStep);
        nextStep = startHackingBatch(ns, target, nextStep, workerCounter, threadCounter);
        ns.tprint(nextStep);
        ++threadCounter;
        if (nextStep.name == "end") {
            return;
        }
        await ns.sleep(100);
    }
}

/**
 * @param {NS} ns
**/
export function startHackingBatch(ns, target, step, workerCounter, threadCounter) {
    let sleepTime;
    let threads;
    // let sleep;
    // ns.tprint(step.next);
    switch (step.name) {
        case "hack":
            // time = ns.getHackTime(target);
            threads = 1;
            sleepTime = HACKING_SYNC_CONSTANT;
            break;
        case "firstWeaken":
            // time = ns.getWeakenTime(target);
            threads = 1;
            sleepTime = 2 * HACKING_SYNC_CONSTANT;
            break;
        case "secondWeaken":
            // time = ns.getWeakenTime(target);
            threads = 1;
            sleepTime = timings.weakenTime + HACKING_SYNC_CONSTANT - timings.growTime;
            break;
        case "grow":
            // time = ns.getGrowTime(target);
            threads = 5;
            sleepTime = timings.weakenTime - HACKING_SYNC_CONSTANT - timings.hackTime;
            break;
    };
    ns.tprint(`running ${step.action}.js`)
    ns.run(`${step.action}.js`, threads, target, workerCounter, threadCounter);
    return hackingActions[`${step.next}`];
    // await ns.sleep(2 * HACKING_SYNC_CONSTANT);
    // await ns.sleep(timings.weakenTime + HACKING_SYNC_CONSTANT - timings.growTime);
    // await ns.sleep(timings.weakenTime + HACKING_SYNC_CONSTANT - timings.growTime);
    // await ns.sleep(timings.weakenTime - HACKING_SYNC_CONSTANT - timings.hackTime);
    // Start first weakening, which lasts for a time weakenTime.
    // Hack must finish T = 200 ms before the end of the first weaken. Then, it must have a delay of weakenTime - T - hackTime.
    // Grow must finish T= 200 ms after the end of the first weaken. Then, it must have a delay of weakenTime + T - growTime.
    // Second weaken has to finish 2T = 400 ms after the end of the first weaken. Then, it must have a delay of oldWeakenTime + 2T - newWeakenTime.
    // Next batch must start 3T after weakenTime
    // ns.run("weaken.js", threads.firstWeakenThreads, target);
    // ns.run("weaken.js", threads.secondWeakenThreads, target);
    // ns.run("grow.js", threads.growThreads, target);
    // ns.run("hack.js", threads.hackThreads, target);
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