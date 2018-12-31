"use strict";

const electron = require("electron");
let t;

console.log("********************* preload *********************");

process.once("loaded", function () {
    try {
        t = {
            electron,
            process,
            require,
            module,
            __filename,
            __dirname
        };
        console.log(t);
        electron.ipcRenderer.send("log", "preload-fine");
    } catch (err) {
        console.log(err);
        electron.ipcRenderer.send("log", err.stack);
        return;
    }

    const g = global;
    // expose electron renderer process modules
    g.electron = t.electron;
    // expose node stuff under node global wrapper because of requirejs
    g.node = {
        process: t.process,
        require: t.require,
        module: t.module,
        __filename: t.__filename,
        __dirname: t.__dirname
    };
    // this is to fix requirejs text plugin
    g.process = t.process;
    g.process.versions["node-webkit"] = true;
});
