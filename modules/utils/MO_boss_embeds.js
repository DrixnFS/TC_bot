const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


const boss_timers = {
    spider_queen_nitre: {
        name: 'Nitre Spider Queen',
        timer: 3600000
    },
    minotaur_king: {
        name: 'Minotaur King',
        timer: 3600000
    },
    spider_queen_clothos: {
        name: 'Clothos Spider Queen',
        timer: 3600000
    }
}

module.exports = () => {

    const msg_arr = []

    Object.keys(boss_timers).map((boss_key) => {
        const button = new MessageButton()
        button.setCustomId(boss_key + '_Timer')
        button.setLabel('Timer')
        button.setStyle('DANGER')

        const btn_row = new MessageActionRow()
        btn_row.addComponents(button) 
        
        const embed = new MessageEmbed()
        embed.setColor('#0099ff')
        embed.setTitle(boss_timers[boss_key].name)
        embed.setDescription('Spawned')
        
        msg_arr.push({
            timer: boss_timers[boss_key].timer,
            msg: {
                embeds: [embed],
                components: [btn_row]
            }
        })
    })

    return msg_arr
}