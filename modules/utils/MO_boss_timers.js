const { MessageEmbed } = require('discord.js');

module.exports = async (current_embed, cached_msg, timer) =>{
    console.log(current_embed)
    const embed = new MessageEmbed()
    embed.setColor('#641D23')
    embed.setTitle(current_embed.title)
    embed.setThumbnail(current_embed.thumbnail.url)

    embed.setFooter({ text: `${timer / 60} minutes untill spawn`, iconURL: current_embed.footer.iconURL });
    cached_msg.edit({embeds: [embed]})

    let current_timer = timer
    const update_interval = setInterval(() => {
        embed.setFooter({ text: `${timer / 60} minutes untill spawn`, iconURL: current_embed.footer.iconURL });

        current_timer = current_timer - 60
        if(current_timer <= 0){
            embed.setColor('#0099ff')
            embed.setFooter({ text: `Spawned`, iconURL: current_embed.footer.iconURL });
            clearInterval(update_interval)
        }

        cached_msg.edit({embeds: [embed]})

    }, 60000)

}