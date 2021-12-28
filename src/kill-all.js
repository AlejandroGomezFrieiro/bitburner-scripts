/** @param {import(".").NS } ns */
import { readServerFile } from "/src/server-scan.js";

export async function main(ns) {
    if (!ns.fileExists("serverFile.txt", "home")){
        ns.exec("server-scan.js", "home");
    }
	let serverList =Object.keys(readServerFile(ns, "serverFile.txt"));
    serverList = serverList.filter( (serverName) => !serverName.includes("home"));
    for (let serverName of serverList){
        ns.killall(serverName);
        console.log("Killed all scripts in " + serverName);
    }
}