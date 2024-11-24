const client = require("../index")
const blacklist_Schema = require("../models/blacklist")

module.exports = {
    name: "interactionCreate",
    once: false,
    /**
     * 
     *  @param {import("discord.js").Interaction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return
        const interactionuser = await interaction.client.users.fetch(`${interaction.user.id}`)
        if (interaction.guild != "1297056552909541417") {
            return interaction.reply({content: "명령어는 2025 범석대 서버에서만 사용해주세요.", ephemeral: true});
        }
        const command = client.commands.get(interaction.commandName)
        if (!command) return

        const blacklist_find = await blacklist_Schema.findOne({ userid: interaction.user.id })

        if (blacklist_find) {
            interaction.reply({content: `당신은 블랙리스트에 등록되었습니다\n사유 : ${blacklist_find.reason }`, ephemeral:true})
            return
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            console.log(error)
        }
    },
}