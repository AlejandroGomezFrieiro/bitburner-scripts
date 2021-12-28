import { FILES_TO_DISTRIBUTE } from "/src/constants.js";
import { readServerFile } from "/src/server-scan.js";

/** @param {NS} ns **/
/** @param {import(".").NS } ns */
export async function main(ns) {
	if (!ns.fileExists("serverFile.txt", "home")) {
		ns.exec("server-scan.js", "home");
	}
	let serverList = Object.keys(readServerFile(ns, "serverFile.txt"));
	await sendFileArrayToServerList(ns, FILES_TO_DISTRIBUTE, serverList);

	ns.spawn("controller.js");
}

export async function sendFileArrayToServerList(ns, fileList, serverList) {
	for (var i = 0; i < serverList.length; ++i) {
		if (ns.hasRootAccess(serverList[i]) == true) {
			await ns.scp(fileList, "home", serverList[i]);
		}
	}
}

