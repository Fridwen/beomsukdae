const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const team_Schema = require("../../models/team")
const athlete_Schema = require("../../models/athlete") 

function checkStringPattern(input) {
    // 정규표현식: 임의의 문자열(A) 뒤에 '#'이 있고 다시 문자열(B)이 있는지 확인
    const pattern = /^.+#.+$/
    return pattern.test(input) ? 1 : 0
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("팀등록").setDescription("2025 범석대 팀을 등록합니다.")
        .addStringOption((f) => f.setName("팀이름").setDescription("팀 이름을 입력해주세요.").setRequired(true))
        .addStringOption((f) => f.setName("팀장").setDescription("팀장의 라인을 선택해주세요.").setRequired(true).addChoices({name:"탑", value:"탑"}, {name:"정글", value:"정글"}, {name:"미드", value:"미드"}, {name:"원딜", value:"원딜"}, {name:"서포터", value:"서포터"}))
        .addStringOption((f) => f.setName("탑").setDescription("탑의 닉네임을 입력해주세요. 닉네임은 꼭 태그까지 입력해주세요. ex) 고려대스마트보안학부25학번#조준범").setRequired(true))
        .addStringOption((f) => f.setName("정글").setDescription("정글의 닉네임을 입력해주세요. 닉네임은 꼭 태그까지 입력해주세요. ex) 고려대스마트보안학부25학번#조준범").setRequired(true))
        .addStringOption((f) => f.setName("미드").setDescription("미드의 닉네임을 입력해주세요. 닉네임은 꼭 태그까지 입력해주세요. ex) 고려대스마트보안학부25학번#조준범").setRequired(true))
        .addStringOption((f) => f.setName("원딜").setDescription("원딜의 닉네임을 입력해주세요. 닉네임은 꼭 태그까지 입력해주세요. ex) 고려대스마트보안학부25학번#조준범").setRequired(true))
        .addStringOption((f) => f.setName("서포터").setDescription("서포터의 닉네임을 입력해주세요. 닉네임은 꼭 태그까지 입력해주세요. ex) 고려대스마트보안학부25학번#조준범").setRequired(true)),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const option_leader = interaction.options.getString("팀장")
        const option_teamname = interaction.options.getString("팀이름")
        const option_top = interaction.options.getString("탑")
        if (checkStringPattern(option_top) == 0) return interaction.reply({content: `탑의 닉네임 형식이 잘못되었습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
        const option_jungle = interaction.options.getString("정글")
        if (checkStringPattern(option_jungle) == 0) return interaction.reply({content: `정글의 닉네임 형식이 잘못되었습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
        const option_mid = interaction.options.getString("미드")
        if (checkStringPattern(option_mid) == 0) return interaction.reply({content: `미드의 닉네임 형식이 잘못되었습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
        const option_adc = interaction.options.getString("원딜")
        if (checkStringPattern(option_adc) == 0) return interaction.reply({content: `원딜의 닉네임 형식이 잘못되었습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
        const option_support = interaction.options.getString("서포터")
        if (checkStringPattern(option_support) == 0) return interaction.reply({content: `서포터의 닉네임 형식이 잘못되었습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
        
        const top_find = await athlete_Schema.findOne({
            nickname: option_top,
        })
        if (!top_find) return interaction.reply({content: `탑이 선수 명단에 존재하지 않습니다. 다시 등록 부탁드립니다.`, ephemeral: true})        
        
        const jungle_find = await athlete_Schema.findOne({
            nickname: option_jungle,
        })
        if (!jungle_find) return interaction.reply({content: `정글이 선수 명단에 존재하지 않습니다. 다시 등록 부탁드립니다.`, ephemeral: true})   
            
        const mid_find = await athlete_Schema.findOne({
            nickname: option_mid,
        })
        if (!mid_find) return interaction.reply({content: `미드가 선수 명단에 존재하지 않습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
        
        const adc_find = await athlete_Schema.findOne({
            nickname: option_adc,
        })
        if (!adc_find) return interaction.reply({content: `원딜이 선수 명단에 존재하지 않습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
            
        const support_find = await athlete_Schema.findOne({
            nickname: option_support,
        })
        if (!support_find) return interaction.reply({content: `서포터가 선수 명단에 존재하지 않습니다. 다시 등록 부탁드립니다.`, ephemeral: true})
        
        const team_find = await team_Schema.findOne({
            userid: interaction.user.id,
        })

        if (!team_find) {
            await new team_Schema({
                leader: option_leader,
                teamname: option_teamname,
                top: option_top,
                jungle: option_jungle,
                mid: option_mid,
                adc: option_adc,
                support: option_support,
                userid: interaction.user.id,
                
            }).save()
            interaction.reply({content: `2025 범석대 팀 등록이 완료되었습니다.\n팀 이름 : ${option_teamname}\n탑 : ${option_top}\n정글 : ${option_jungle}\n미드 : ${option_mid}\n원딜 : ${option_adc}\n서포터 : ${option_support}`, ephemeral: true})
        } else {
            await team_Schema.updateOne({userid: interaction.user.id}, {
                leader: option_leader,
                teamname: option_teamname,
                top: option_top,
                jungle: option_jungle,
                mid: option_mid,
                adc: option_adc,
                support: option_support,
                userid: interaction.user.id,
            })
            interaction.reply({content: `이미 2025 범석대에 등록된 기록이 있습니다. 내용을 수정합니다.\n[ 수정된 내용 ]\n팀 이름 : ${team_find.teamname} -> ${option_teamname}\n탑 : ${team_find.top} -> ${option_top}\n정글 : ${team_find.jungle} -> ${option_jungle}\n미드 : ${team_find.mid} -> ${option_mid}\n원딜 : ${team_find.adc} -> ${option_adc}\n서포터 : ${team_find.support} -> ${option_support}`, ephemeral: true})
        }
    },
}