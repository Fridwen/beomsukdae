const { Schema, model } = require("mongoose")

const schema = new Schema({
    teamname: String,
    leader: String,
    userid: String,
    top: String,
    jungle: String,
    mid: String,
    adc: String,
    support: String,
})

module.exports = model("Team", schema)