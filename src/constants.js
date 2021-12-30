export const EXCLUDED_SERVERS = ["home", "pserv", "darkweb"];

export const FILES_TO_DISTRIBUTE = ["worker.js", "weaken.js", "grow.js", "hack.js", "constants.js", "scan-servers.js"];

export const NEXT_TARGET_PORT = 1;

export const HACKING_SYNC_CONSTANT = 200;

export const SERVER_FORTIFY_AMOUNT = 0.002; // Amount by which server's security increases when its hacked/grown
export const SERVER_WEAKEN_AMOUNT = 0.05; // Amount by which server's security decreases when weakened

export const hackingActions = {
    end: {
        name: "end",
    },

    firstWeaken: {
        name: "firstWeaken",
        action: "weaken",
        next: "secondWeaken"
    },
    secondWeaken: {
        name: "secondWeaken",
        action: "weaken",
        next: "grow"
    },
    grow: {
        name: "grow",
        action: "grow",
        next: "hack"
    },
    hack: {
        name: "hack",
        action: "hack",
        next: "end"
    },


}