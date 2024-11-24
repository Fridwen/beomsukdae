const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const team_Schema = require("../../models/team") 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("팀정보").setDescription("특정한 팀의 정보를 확인합니다.")
        .addStringOption((f) => f.setName("팀이름").setDescription("팀이름을 입력해주세요.").setRequired(true)),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const option_teamname = interaction.options.getString("팀이름")
        const team_find = await team_Schema.findOne({
            teamname: option_teamname,
        })
        if (!team_find) {
            interaction.reply({content: `${option_teamname} 팀은 2025 범석대에 등록하지 않았습니다.`, ephemeral: true})
        } else {
            if (team_find.leader == '탑') team_find.top = team_find.top+"(팀장)"
            if (team_find.leader == '정글') team_find.jungle = team_find.jungle+"(팀장)"
            if (team_find.leader == '미드') team_find.mid = team_find.mid+"(팀장)"
            if (team_find.leader == '원딜') team_find.adc = team_find.adc+"(팀장)"
            if (team_find.leader == '서포터') team_find.support = team_find.support+"(팀장)"
            const TeamEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${option_teamname} 팀의 정보`)
            .addFields({ name: '탑', value: `${team_find.top}` })
            .addFields({ name: '정글', value: `${team_find.jungle}` })
            .addFields({ name: '미드', value: `${team_find.mid}` })
            .addFields({ name: '원딜', value: `${team_find.adc}` })
            .addFields({ name: '서포터', value: `${team_find.support}` })
            .setTimestamp() 
            interaction.reply({ embeds : [TeamEmbed], ephemeral: true})
        }
        
    }
}