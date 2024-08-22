'use strict'

const { default: mongoose } = require("mongoose")
const os = require('os')
const process = require('process')
const _SECONDS = 5000

const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number connections::${numConnection}`);
}

const checkOverload = () => {
    setInterval(()=> {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnections = numCores * 5 //neu 1core 5 ket noi
        console.log(`Active connections: ${numConnection}`)
        console.log(`Memory Usage: ${memoryUsage/1024/1024} MB`)
        if (numConnection > maxConnections) {
            console.log(`Connections overload detected`)
        }
    }, _SECONDS)
}

module.exports = {countConnect, checkOverload}