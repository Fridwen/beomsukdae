module.exports = {
    name:"messageCreate",
    once:false,
    execute(message) {
        if (message.content == "안녕" ) {
            message.reply({content : `ㅎㅇ`})
        }
    }    
}