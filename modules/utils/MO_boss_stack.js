const boss_timer_fce = require(`${drixnBot.paths.utils}/MO_boss_timers.js`)

const active_boss_intervals = {}

module.exports = BossStack = {

    createDefaultTimers: (channel, timer_list) =>{
        timer_list.map((timer) => {
            active_boss_intervals[timer.name] = {
                timer: timer.timer
            }
            BossStack.__sendDefaultMsg(channel, timer);
        })
    },

    timerBtnCb: (key) =>{
        boss_timer_fce(active_boss_intervals[key].embed_msg, active_boss_intervals[key].cached_msg, active_boss_intervals[key].timer)
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