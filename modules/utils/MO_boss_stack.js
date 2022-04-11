const { MessageEmbed } = require('discord.js');

const BossTimer = require(`${drixnBot.paths.utils}/MO_boss_timers.js`)

const active_boss_intervals = {}
const current_intervals = {}

module.exports = BossStack = {

    getBossTimer: (name) => {
        return active_boss_intervals[name].timer
    },

    getBossImage: (name) => {
        return active_boss_intervals[name].embed_msg.thumbnail.url
    },

    createDefaultTimers: (channel, timer_list) =>{
        timer_list.map((timer) => {
            active_boss_intervals[timer.name] = {
                timer: timer.timer
            }
            BossStack.__sendDefaultMsg(channel, timer);
        })
    },

    timerBtnCb: (key, client, BossStack) =>{
        if(current_intervals[key]) {
            BossTimer.removeTimer(active_boss_intervals[key].embed_msg)
            delete current_intervals[key]
        }
        BossTimer.createTimer(client, BossStack, active_boss_intervals[key].embed_msg, active_boss_intervals[key].cached_msg, active_boss_intervals[key].timer)
        current_intervals[key] = true
    },

    aliveBtnCb: (key) =>{
        if(current_intervals[key]) {
            BossTimer.removeTimer(active_boss_intervals[key].embed_msg)
            delete current_intervals[key]

            const embed = new MessageEmbed()
            embed.setTitle(active_boss_intervals[key].embed_msg.title)
            embed.setThumbnail(active_boss_intervals[key].embed_msg.thumbnail.url)
            embed.setColor('#0099ff')
            embed.setFooter({ text: `Spawned`, iconURL: active_boss_intervals[key].embed_msg.footer.iconURL });
            embed.setTimestamp()

            active_boss_intervals[key].cached_msg.edit({embeds: [embed]})
        }
    },

    __sendDefaultMsg: async (channel, timer_obj) =>{
        const sent_msg = await channel.send(timer_obj.msg)
        active_boss_intervals[timer_obj.name] = {
            ...active_boss_intervals[timer_obj.name],
            cached_msg: sent_msg,
            embed_msg: timer_obj.msg.embeds[0]
        }
    }

}