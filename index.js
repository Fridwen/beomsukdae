const dotenv = require("dotenv")
dotenv.config()

const { Client, Collection, REST, Routes } = require("discord.js")
const client = (module.exports = new Client({intents:[131071]}))
client.login(process.env.TOKEN)



const fs = require("fs")

const eventsPath = "./events"
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"))

for (const file of eventFiles) {
    const filePath = `./${eventsPath}/${file}`
    const event = require(filePath)
    if (event.once == true) {
        client.once(event.name, (args) => event.execute(args))    
    } else {
        client.on(event.name, (args) => event.execute(args))
    }
}

client.commands = new Collection()

const commands_json = []

const commandsCategoryPath = "./commands"
const commandsCategoryFiles = fs.readdirSync(commandsCategoryPath)

for (const category of commandsCategoryFiles) {
    const commandsPath = `./commands/${category}`
    const commandsFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"))
    for (const file of commandsFiles) {
        const command = require(`./commands/${category}/${file}`)
        client.commands.set(command.data.name, command);
        commands_json.push(command.data.toJSON())
    }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN)

rest.put(Routes.applicationCommands(process.env.ID),{body:commands_json})
    .then(command=>console.log(`${command.length}개의 커맨드를 푸쉬했습니다.`))
    .catch(console.error)

const mongoose = require("mongoose");
mongoose.set("strictQuery", true)

mongoose
    .connect(process.env.MONGOURL, {
        // useUnifedTopology: true,
        useNewUrlParser: true,
    })
    .then(console.log("DB가 연결됨 ㅋㅋ"))

mongoose.connection.on("reconnected", ()=> {
    console.log("DB가 다시 연결됨 ㅋㅋ")
})

mongoose.connection.on("disconnected", ()=> {
    console.log("DB 연결 끊어짐 ㅋㅋ")
})

