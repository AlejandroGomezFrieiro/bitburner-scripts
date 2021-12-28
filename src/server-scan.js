/** @param {import(".").NS } ns */

export async function main(ns) {
	await writeServerFile(ns);
	const serverFile = readServerFile(ns);
	console.log(serverFile);
}
/**
 * @param {NS} ns
**/
export function breathFirstSearch(ns, injectedFunctions = []) {
	let serverQueue = new Queue();
	serverQueue.enqueue("home");
	const visitedServersSet = new Set();
	visitedServersSet.add("home");
	// Breadth first search to nuke all available servers
	while (serverQueue.length > 0) {
		let temp = ns.scan(serverQueue.peek());
		serverQueue.dequeue();
		for (let i = 0; i < temp.length; ++i) {
			if (visitedServersSet.has(temp[i]) == false) {
				serverQueue.enqueue(temp[i]);

				if (injectedFunctions.length > 0) {
					for (let injectedFunction of injectedFunctions) {
						injectedFunction(ns, temp[i]);
					}
				}
				visitedServersSet.add(temp[i]);
			}
		}
	}
	return visitedServersSet;
}

/** @param {import(".").NS } ns */
/**
 * @param {NS} ns
**/
export async function writeServerFile(ns = ns, fileName = 'serverFile.txt', funcName = generateServerObject) {
	let targetSet = breathFirstSearch(ns);
	let serverList = {};
	for (let serverName of targetSet) {
		serverList[`${serverName}`] = funcName(ns, serverName);
	}
	const data = JSON.stringify(serverList, null, 4);
	await ns.write(fileName, data, 'w');
}

/** @param {import(".").NS } ns */
/**
 * @param {NS} ns
**/
export function readServerFile(ns = ns, fileName = "serverFile.txt") {
	const fs = require('fs');

	// read JSON object from file
	ns.read(fileName);

	// parse JSON object
	const serverList = JSON.parse(data.toString());

	// print JSON object
	console.log(serverList);

	return serverList;
}

export class Queue extends Array {
	enqueue(val) {
		this.push(val);
	}

	dequeue() {
		return this.shift();
	}

	peek() {
		return this[0];
	}

	isEmpty() {
		return this.length === 0;
	}
}

/**
 * @param {NS} ns
 **/
 /** @param {import(".").NS } ns */
function generateServerObject(ns, serverName) {
	const usedRam = ns.getServerUsedRam(serverName);
	const maxRam = ns.getServerMaxRam(serverName);
	const availableMoney = ns.getServerMoneyAvailable(serverName);
	const maxMoney = ns.getServerMaxMoney(serverName);
	const minSec = ns.getServerMinSecurityLevel(serverName);
	const sec = ns.getServerSecurityLevel(serverName);
	const hackPercentage = ns.hackAnalyze(serverName);
	return {
		"freeRAM": maxRam.toFixed(2) - usedRam.toFixed(2),
		"maxRAM": maxRam,
		"availableMoney": availableMoney,
		"maxMoney": maxMoney,
		"security": minSec / sec,
		"growth": ns.getServerGrowth(serverName),
		"hackTime": ns.tFormat(ns.getHackTime(serverName)),
		"growTime": ns.tFormat(ns.getGrowTime(serverName)),
		"weakenTime": ns.tFormat(ns.getWeakenTime(serverName)),
		"doubleGrowThreads": (ns.growthAnalyze(serverName, 2)).toFixed(2),
		"tripleGrowThreads": (ns.growthAnalyze(serverName, 3)).toFixed(2),
		"quadrupleGrowThreads": (ns.growthAnalyze(serverName, 4)).toFixed(2),
		"hackMoney": hackPercentage,
		"hack 10%": (.10 / ns.hackAnalyze(serverName)).toFixed(2),
		"hack 25%": (.25 / ns.hackAnalyze(serverName)).toFixed(2),
		"halfHackThreads": (.5 / hackPercentage).toFixed(2),
		"hackChance": (ns.hackAnalyzeChance(serverName)).toFixed(2)
	};
}

 /** @param {import(".").NS } ns */
/**
 * @param {NS} ns
 **/
 function generateServerSimpleObject(ns, serverName) {
	const usedRam = ns.getServerUsedRam(serverName);
	const maxRam = ns.getServerMaxRam(serverName);
	const availableMoney = ns.getServerMoneyAvailable(serverName);
	const maxMoney = ns.getServerMaxMoney(serverName);
	const minSec = ns.getServerMinSecurityLevel(serverName);
	const sec = ns.getServerSecurityLevel(serverName);
	return {
		"freeRAM": maxRam - usedRam,
		"maxRAM": maxRam,
		"availableMoney": availableMoney,
		"maxMoney": maxMoney,
		"security": minSec / sec,
		"growth": ns.getServerGrowth(serverName),
		"hackTime": ns.tFormat(ns.getHackTime(serverName)),
		"growTime": ns.tFormat(ns.getGrowTime(serverName)),
		"weakenTime": ns.tFormat(ns.getWeakenTime(serverName)),
	};
}
