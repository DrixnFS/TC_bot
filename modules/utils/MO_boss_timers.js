const { MessageEmbed } = require('discord.js');

const BossPinger = require(`${drixnBot.paths.utils}/MO_boss_pinger.js`)

const active_intervals = {}

module.exports = BossTimer = {
    createTimer: async (client, BossStack, current_embed, cached_msg, timer) =>{
        const embed = new MessageEmbed()
        embed.setColor('#641D23')
        embed.setTitle(current_embed.title)
        embed.setThumbnail(current_embed.thumbnail.url)

        embed.setFooter({ text: `${timer / 60} minutes untill spawn. Died at:`, iconURL: current_embed.footer.iconURL });
        embed.setTimestamp()
        cached_msg.edit({embeds: [embed]})

        let current_timer = timer

        const update_interval = setInterval(() => {
            current_timer = current_timer - 60

            if(current_timer <= 0){
                embed.setColor('#0099ff')
                embed.setFooter({ text: `Spawned`, iconURL: current_embed.footer.iconURL });
                embed.setTimestamp()
                clearInterval(update_interval)
                BossPinger.sendTimerRunOutPing(client, BossStack, current_embed.title)
            }else {
                embed.setFooter({ text: `${current_timer / 60} minutes untill spawn. Died at:`, iconURL: current_embed.footer.iconURL });
            }
            cached_msg.edit({embeds: [embed]})
        }, 60000)

        active_intervals[current_embed.title] = update_interval
    },

    removeTimer: async(current_embed) =>{
        if(active_intervals[current_embed.title]){
            clearInterval(active_intervals[current_embed.title])
            delete active_intervals[current_embed.title]
        }
    }
}