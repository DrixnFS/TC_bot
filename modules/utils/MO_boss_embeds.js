const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


const boss_timers = {
    spider_queen_nitre: {
        name: 'Nitre Spider Queen',
        timer: 3600,
        img: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/aafa3616630e70b47aca86234df2e3f6095beb54.jpg'
    },
    spider_queen_clothos: {
        name: 'Clothos Spider Queen',
        timer: 1800,
        img: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/aafa3616630e70b47aca86234df2e3f6095beb54.jpg'
    },
    minotaur_king: {
        name: 'Minotaur King',
        timer: 3600,
        img: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/c25cefda49e22653db33d0b93d100adaeac86902.jpg'
    },
    sator_vessel: {
        name: 'Sator Vessel',
        timer: 1800,
        img: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/4a43199d54e0287d3c1e2050db96e85085428928.jpg'
    },
    Illusionist: {
        name: 'Illusionist',
        timer: 1800,
        img: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/705852c0aedab84962ca56f2f1838dcd6c2141f6.jpg'
    },
    fabernum_necromancer: {
        name: 'Fabernum Necromancer',
        timer: 1800,
        img: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/a544856ebbe9f732f70d50e67d28118dfd944eab.jpg'
    },
    risar_chieftan: {
        name: 'Risar Chieftan',
        timer: 1800,
        img: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/bc587a18c28eceefed6876cd8abc596e77043837.jpg'
    }
}

module.exports = () => {

    const msg_arr = []

    Object.keys(boss_timers).map((boss_key) => {
        const button = new MessageButton()
        button.setCustomId(boss_key + '_Timer')
        button.setLabel('Timer')
        button.setStyle('PRIMARY')

        const btn_row = new MessageActionRow()
        btn_row.addComponents(button) 
        
        const embed = new MessageEmbed()
        embed.setColor('#0099ff')
        embed.setTitle(boss_timers[boss_key].name)
        embed.setFooter({ text: 'Spawned', iconURL: 'https://cdn.discordapp.com/icons/780039748025843733/a6231ab72eacd2ae02558a95c6e3d593.webp?size=96' });
        embed.setThumbnail(boss_timers[boss_key].img)
        
        msg_arr.push({
            name: boss_timers[boss_key].name,
            timer: boss_timers[boss_key].timer,
            msg: {
                embeds: [embed],
                components: [btn_row]
            }
        })
    })

    return msg_arr
}