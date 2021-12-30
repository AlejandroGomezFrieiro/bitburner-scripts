/** @param {import(".").NS } ns **/

export async function main(ns) {

    const maxRam = ns.getPurchasedServerMaxRam();
    const maxServers = ns.getPurchasedServerLimit();
    const serverName = "pserv";
    // Const max number of servers
    while (true) {
        // let myMoney = ns.getServerMoneyAvailable("home");
        const purchasedServers = ns.getPurchasedServers();
        let counter = 0;
        while (purchasedServers < maxServers) {
            if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(2)) {
                ns.purchaseServer(`${serverName}-${counter}`, 2);
                ++counter;
            }
        }

        if (purchasedServers.length > 0) {
            for (let server of purchasedServers) {
                if (canUpgradeServer(ns, server, ns.getServerMoneyAvailable("home"))){
                    upgradeServer(ns, server);
                }
            }
        }
        await ns.sleep(20000);
    }
}

/** @param {import(".").NS } ns */
export function canUpgradeServer(ns, server, availableMoney) {
    const targetRAMPrice = ns.getPurchasedServerCost(2 * ns.getServerMaxRam(server));
    if (availableMoney > targetRAMPrice) {
        return true;
    }
    return false;

}

/** @param {import(".").NS } ns */
export function upgradeServer(ns, server) {
    ns.deleteServer(server);
    ns.purchaseServer(server, 2 * ns.getServerMaxRam(server));
}
