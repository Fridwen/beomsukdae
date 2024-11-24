const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const athlete_Schema = require("../../models/athlete") 

module.exports = {
    data: new SlashCommandBuilder()
        .setName("지원자목록").setDescription("2025 범석대 지원자 목록을 확인합니다."),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        // if (interaction.user.id != "686565060826366004") return
        var top = []
        var jungle = []
        var mid = []
        var adc = []
        var support = []
        await Promise.all([
            athlete_Schema.find({position: "탑"}).then(ath => {
                ath.forEach(player => top.push(`${player.nickname}(${player.tier})`));
            }),
            athlete_Schema.find({position: "정글"}).then(ath => {
                ath.forEach(player => jungle.push(`${player.nickname}(${player.tier})`));
            }),
            athlete_Schema.find({position: "미드"}).then(ath => {
                ath.forEach(player => mid.push(`${player.nickname}(${player.tier})`));
            }),
            athlete_Schema.find({position: "원딜"}).then(ath => {
                ath.forEach(player => adc.push(`${player.nickname}(${player.tier})`));
            }),
            athlete_Schema.find({position: "서포터"}).then(ath => {
                ath.forEach(player => support.push(`${player.nickname}(${player.tier})`));
            })
        ])
        const topResult = top.length > 0 ? top.join(', ') : '지원자 없음';
        const jungleResult = jungle.length > 0 ? jungle.join(', ') : '지원자 없음';
        const midResult = mid.length > 0 ? mid.join(', ') : '지원자 없음';
        const adcResult = adc.length > 0 ? adc.join(', ') : '지원자 없음';
        const supportResult = support.length > 0 ? support.join(', ') : '지원자 없음';

        const Embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('2025 범석대 지원자 목록')
            .setAuthor({ name: '2025 범석대 지원', iconURL: 'https://cdn.discordapp.com/attachments/1274340092324089861/1296812372727697429/2025--001.png?ex=6713a623&is=671254a3&hm=edc8487481028c5f3b7b5f7233727dbbddf110414bcb10cdea6cbe0175f61ce3&'})
            .addFields({ name: '탑', value: `${topResult}` })
            .addFields({ name: '정글', value: `${jungleResult}` })
            .addFields({ name: '미드', value: `${midResult}` })
            .addFields({ name: '원딜', value: `${adcResult}` })
            .addFields({ name: '서포터', value: `${supportResult}` })
            .setTimestamp() 
        interaction.reply({ embeds : [Embed], ephemeral: true})
        
    }
}