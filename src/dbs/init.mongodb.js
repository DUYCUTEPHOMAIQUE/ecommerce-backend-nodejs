'use strict'

const { default: mongoose } = require("mongoose")
const {db: {port, host, name}} = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`
const {countConnect} = require('../helpers/check.connect')

console.log(`connectString:: ${connectString}`)
class Database {
    constructor() {
        this.connect()
    }
    connect(type = "mongodb") {
        if(1===1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(connectString).then(_ => {
            console.log('Connect MongoDB successfully', countConnect())
        })
        .catch(err => console.log("connect error"))
    }
    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
    
}
const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb