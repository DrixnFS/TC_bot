const { MessageEmbed } = require('discord.js');


module.exports = BossPinger = {

    sendAliveBtnClickPing: (client, BossStack, boss_name, user) =>{
        const footer_img = BossStack.getBossImage(boss_name)
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${boss_name} just respawned`)
            .setDescription(`Manually triggered`)
            .setFooter({ text: user.username, iconURL: footer_img })
            .setTimestamp()

        const msg = {embeds: [embed]}
        BossPinger.__sendMessage(client, msg)
    },

    sendDeadBtnClickPing: (client, BossStack, boss_name, user) =>{
        const footer_img = BossStack.getBossImage(boss_name)
        const embed = new MessageEmbed()
            .setColor('#641D23')
            .setTitle(`${boss_name} was slain`)
            .setDescription(`${BossStack.getBossTimer(boss_name) / 60} minutes untill spawn`)
            .setFooter({ text: user.username, iconURL: footer_img })
            .setTimestamp()

        const msg = {
            embeds: [embed]
        }

        BossPinger.__sendMessage(client, msg)
    },

    /**
     * 
     * @param {*} client 
     */
    sendTimerRunOutPing: (client, BossStack, boss_name) =>{
        const footer_img = BossStack.getBossImage(boss_name)
        const embed = new MessageEmbed()
            .setColor('#641D23')
            .setTitle(`${boss_name} just respawned`)
            .setDescription(`Timer finished`)
            .setFooter({ text: 'Timer', iconURL: footer_img })
            .setTimestamp()

        const msg = {
            content:`<@&${process.env['BOSS_PING_ROLE_ID']}>`,
            embeds: [embed]
        }

        BossPinger.__sendMessage(client, msg)
    },

    /**
     * 
     * @param {*} client 
     * @param {*} msg 
     * @returns 
     */
    __sendMessage: (client, msg) =>{
        const channel = BossPinger.__getProperChannel(client)
        if (!channel) return;
        channel.send(msg)
    },
    
    /**
     * Gets the channel where its supposed to ping into
     * @param {*} client - discord Js client instance
     * @returns 
     */
    __getProperChannel: (client) =>{
        return client.channels.cache.get(process.env['BOSS_PING_CHANNEL_ID'].toString())
    },

}