const { MessageEmbed } = require('discord.js');

module.exports = async (current_embed, cached_msg, timer) =>{
    const embed = new MessageEmbed()
    embed.setColor('#0099ff')
    embed.setTitle(current_embed.title)
    embed.setThumbnail(current_embed.thumbnail.url)

    embed.setDescription(`${timer / 60} minutes untill spawn`)
    cached_msg.edit({embeds: [embed]})

    let current_timer = timer
    const update_interval = setInterval(() => {
        embed.setDescription(`${current_timer / 60} minutes untill spawn`)

        cached_msg.edit({embeds: [embed]})

        current_timer = current_timer - 60
        if(current_timer <= 0){
            embed.setDescription(`Spawned`)
            clearInterval(update_interval)
        }
    }, 60000)

}