const { Schema, model } = require("mongoose")

const schema = new Schema({
    name: String,
})

module.exports = model("Match", schema)