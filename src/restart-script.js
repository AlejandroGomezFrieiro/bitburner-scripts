import { readServerFile } from "./server-scan.js";
/** @param {NS} ns **/
/** @param {import(".").NS } ns */
export async function main(ns) {
	const filesToSend = ["hack-script.js", "weaken.js", "grow.js", "hack.js"];

    if (!ns.fileExists("serverFile.txt", "home")){
        ns.exec("server-scan.js", "home");
    }
	let serverList =Object.keys(readServerFile(ns, "serverFile.txt"));
	let rootedServers = serverList.filter((serverName) => ns.hasRootAccess(serverName));

	await sendFileArrayToServerList(ns, filesToSend, serverList);
	let sortedTargetArray = Array.from(rootedServers).filter(
		(serverName) => (!serverName.includes("pserv") || !serverName.includes("home")) && ns.getServerMaxMoney(serverName) > 1.0
	);
	rootedServers = rootedServers.sort(function compareFunction(a, b) {
		let difference = ns.getServerMaxRam(b) - ns.getServerMaxRam(a);
		return difference;
	});
	while (true) {
		let tempArray = sortedTargetArray.sort(function compareFunction(a, b) {
			let difference = profitabilityMetric(ns, b) - profitabilityMetric(ns, a);
			return difference;
		});
		for (let i = 0; i < rootedServers.length; ++i) {
			let counter = 0;
			while (!(ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(tempArray[counter]))) {
				++counter;
			}
			if (ns.getHackingLevel() > 300) {
				ns.exec("hack-script.js", rootedServers[i], 1, tempArray[counter], rootedServers[i]);
			}
			else {
				ns.exec("hack-script.js", rootedServers[i], 1, "joesguns", rootedServers[i]);
			}
		}
		await ns.sleep(10 * 1000);
	}
}



export async function sendFileArrayToServerList(ns, fileList, serverList) {
	for (var i = 0; i < serverList.length; ++i) {
		if (ns.hasRootAccess(serverList[i]) == true) {
			await ns.scp(fileList, "home", serverList[i]);
		}
	}
}


/** @param {NS} ns **/
function profitabilityMetric(ns, server) {
	return ns.getServerMoneyAvailable(server)/ns.getServerMaxMoney(server);
}
