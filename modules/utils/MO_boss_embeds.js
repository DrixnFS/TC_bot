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
        const btn_row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('Killed')
                .setLabel('Killed')
                .setStyle('Danger')
            ) 
        
        const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(boss_timers[boss_key].name)
                .setDescription('Spawned')
        
        msg_arr.append({
            timer: boss_timers[boss_key].timer,
            msg: {
                embeds: [embed],
                components: [btn_row]
            }
        })
    })

        return msg_arr
}