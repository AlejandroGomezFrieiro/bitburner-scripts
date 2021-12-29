
import { PORT_LIST } from "./port-programs.js";
import { readServerFile } from "./server-scan.js";


/** @param {NS} ns **/
/** @param {import(".").NS } ns */
export async function main(ns) {
	let availablePortHacks = PORT_LIST.filter(({ filename }) => ns.fileExists(filename, 'home'));
    let targetSet = Object.keys(readServerFile(ns));
	targetSet = targetSet.filter((name) => !name.includes("home"));
	for (let target of targetSet) {
		if (availablePortHacks.length > 0) {
			for (let i = 0; i < availablePortHacks.length; ++i) {
				await openPort(ns, target, availablePortHacks[i]);
			}
			if (checkServerPorts(ns, target, availablePortHacks) == true) {
				nukeServer(ns, target);
			}
		}
		else if (ns.getServerNumPortsRequired(target) == 0){ 
			nukeServer(ns, target);
		}
	}
}

/** @param {NS} ns **/
export async function openPort(ns, server, portHack) {
	await portHack.command(ns, server);
	ns.tprint(`${server}: Opened up the ${portHack.portName} port.`);
}

/** @param {NS} ns **/
export function nukeServer(ns, server) {
	if (!ns.hasRootAccess(server)) {
		ns.tprint("Nuking " + server);
		ns.nuke(server);
	}
}

/** @param {NS} ns **/
export function checkServerPorts(ns, server, availablePortHacks) {
	return ns.getServerNumPortsRequired(server) <= availablePortHacks.length;
}

/** @param {NS} ns **/
export function openPorts(ns, target) {
	let availablePortHacks = PORT_LIST.filter(({ filename }) => ns.fileExists(filename, 'home'));
	if (availablePortHacks.length > 0) {
		for (let i = 0; i < availablePortHacks.length; ++i) {
			openPort(ns, target, availablePortHacks[i]);
		}
	}
}