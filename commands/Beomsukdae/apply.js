const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const athlete_Schema = require("../../models/athlete") 

function checkStringPattern(input) {
    // 정규표현식: 임의의 문자열(A) 뒤에 '#'이 있고 다시 문자열(B)이 있는지 확인
    const pattern = /^.+#.+$/
    return pattern.test(input) ? 1 : 0
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("선수등록").setDescription("2025 범석대 선수 명단에 등록합니다.")
        .addStringOption((f) => f.setName("닉네임").setDescription("닉네임을 입력해주세요. 닉네임은 꼭 태그까지 입력해주세요. ex) 고려대스마트보안학부25학번#조준범").setRequired(true))
        .addStringOption((f) => f.setName("포지션").setDescription("포지션을 입력해주세요.").setRequired(true).addChoices({name: "탑", value: "탑"},{name: "정글", value: "정글"},{name: "미드", value: "미드"},{name: "원딜", value: "원딜"},{name: "서포터", value: "서포터"},))
        .addStringOption((f) => f.setName("티어").setDescription("현재 티어를 입력해주세요. (단, 솔랭 50판 이하라면 S14-1, S14-2중 최고 티어를 입력해주세요. 마무리 티어가 아니어도 상관 X) ex) 다이아몬드 4").setRequired(true))
        .addStringOption((f) => f.setName("모스트1").setDescription("모스트 1 챔피언을 입력해주세요.").setRequired(true))
        .addStringOption((f) => f.setName("모스트2").setDescription("모스트 2 챔피언을 입력해주세요.").setRequired(true))
        .addStringOption((f) => f.setName("모스트3").setDescription("모스트 3 챔피언을 입력해주세요.").setRequired(true))
        .addStringOption((f) => f.setName("각오").setDescription("각오 한 마디를 작성해주세요.").setRequired(true)),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        // if (interaction.user.id != "686565060826366004") return
        const option_nickname = interaction.options.getString("닉네임")

        if (checkStringPattern(option_nickname) == 0) return interaction.reply({content: `닉네임 형식이 잘못되었습니다. 다시 지원 부탁드립니다.`, ephemeral: true})
        const option_position = interaction.options.getString("포지션")
        const option_tier = interaction.options.getString("티어")
        const option_most1 = interaction.options.getString("모스트1")
        const option_most2 = interaction.options.getString("모스트2")
        const option_most3 = interaction.options.getString("모스트3")
        const option_gakoh = interaction.options.getString("각오")
        const athlete_find = await athlete_Schema.findOne({
            userid: interaction.user.id,
        })
        const already_find = await athlete_Schema.findOne({
            nickname: option_nickname
        })
        if (already_find && already_find.userid != interaction.user.id) return interaction.reply({content: `이미 지원한 기록이 있는 닉네임입니다.`, ephemeral: true})
        if (!athlete_find) {
            await new athlete_Schema({
                userid: interaction.user.id,
                nickname: option_nickname,
                position: option_position,
                tier: option_tier,
                most1: option_most1,
                most2: option_most2,
                most3: option_most3,
                gakoh: option_gakoh,
            }).save()
            interaction.reply({content: `2025 범석대에 지원이 완료되었습니다.\n닉네임 : ${option_nickname}\n포지션 : ${option_position}\n티어 : ${option_tier}\n모스트1 : ${option_most1}\n모스트2 : ${option_most2}\n모스트3 : ${option_most3}\n각오 : ${option_gakoh}`, ephemeral: true})
            const fridwen = await interaction.client.users.fetch('686565060826366004')
            await fridwen.send({
                content: `<@${interaction.user.id}>님이 선수등록하셨습니다.\n닉네임: ${option_nickname}`,
            })
        } else {
            await athlete_Schema.updateOne({userid: interaction.user.id}, {
                nickname: option_nickname,
                position: option_position,
                tier: option_tier,
                most1: option_most1,
                most2: option_most2,
                most3: option_most3,
                gakoh: option_gakoh,
            })
            interaction.reply({content: `이미 2025 범석대에 지원하신 기록이 있습니다. 지원 내용을 수정합니다.\n[ 수정된 내용 ]\n닉네임 : ${athlete_find.nickname} -> ${option_nickname}\n포지션 : ${athlete_find.position} -> ${option_position}\n티어 : ${athlete_find.tier} -> ${option_tier}\n모스트1 : ${athlete_find.most1} -> ${option_most1}\n모스트2 : ${athlete_find.most2} -> ${option_most2}\n모스트3 : ${athlete_find.most3} -> ${option_most3}\n각오 : ${athlete_find.gakoh} -> ${option_gakoh}`, ephemeral: true})
        }
    },
}