const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("문의")
        .setDescription("봇 제작자에게 문의합니다.")
        .addStringOption((f) => f.setName("내용").setDescription("문의할 내용을 적어주세요").setRequired(true)),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const option_content = interaction.options.getString("내용")
        if (!option_content) interaction.reply({ ephemeral: true, content: `내용을 제대로 입력해주세요.`})
        
        const fridwen = await interaction.client.users.fetch('686565060826366004')
        await fridwen.send({
            content: `<@${interaction.user.id}>에게서 문의가 도착했습니다.\n내용: ${option_content}`,
        })
        interaction.reply({ ephemeral: true, content: `문의를 전송했습니다.`})
        
    },
}