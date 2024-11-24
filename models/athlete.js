const { Schema, model } = require("mongoose")

const schema = new Schema({
    userid: String,
    nickname: String,
    position: String,
    tier: String,
    gakoh: String,
    most1: String,
    most2: String,
    most3: String,
})

module.exports = model("Athlete", schema)