const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const athlete_Schema = require("../../models/athlete") 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("선수정보").setDescription("특정한 선수의 정보를 확인합니다.")
        .addStringOption((f) => f.setName("닉네임").setDescription("닉네임을 입력해주세요. 닉네임은 꼭 태그까지 입력해주세요. ex) 고려대스마트보안학부25학번#조준범").setRequired(true)),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const option_nickname = interaction.options.getString("닉네임")
        const athlete_find = await athlete_Schema.findOne({
            nickname: option_nickname,
        })
        if (!athlete_find) {
            interaction.reply({content: `${option_nickname}님은 2025 범석대에 지원하지 않았습니다.`, ephemeral: true})
        } else {
            const PlayerEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${option_nickname}님의 정보`)
            .addFields({ name: '포지션', value: `${athlete_find.position}` })
            .addFields({ name: '티어', value: `${athlete_find.tier}` })
            .addFields({ name: '모스트 3', value: `${athlete_find.most1}, ${athlete_find.most2}, ${athlete_find.most3}` })
            .addFields({ name: '각오', value: `${athlete_find.gakoh}` })
            .setTimestamp() 
            interaction.reply({ embeds : [PlayerEmbed], ephemeral: true})
        }
        
    }
}