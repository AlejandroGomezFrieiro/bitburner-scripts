import { FILES_TO_DISTRIBUTE } from "./constants.js";
import { readServerFile } from "./server-scan.js";

/** @param {import(".").NS } ns */
/** @param {NS} ns **/
export async function main(ns) {
	if (!ns.fileExists("serverFile.txt", "home")) {
		ns.exec("server-scan.js", "home");
	}
	let serverList = Object.keys(readServerFile(ns, "serverFile.txt"));
	await sendFileArrayToServerList(ns, FILES_TO_DISTRIBUTE, serverList);

	ns.tprint("Files sent, starting controller.js");
	ns.spawn("controller.js");
}

/** @param {import(".").NS } ns */
/** @param {NS} ns **/
export async function sendFileArrayToServerList(ns, fileList, serverList) {
	for (var i = 0; i < serverList.length; ++i) {
		if (ns.hasRootAccess(serverList[i]) == true) {
			await ns.scp(fileList, "home", serverList[i]);
		}
	}
}

