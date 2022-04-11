const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = BossRole = {
    createEmbed: (channel) =>{
        const accept_btn = new MessageButton()
            .setCustomId('boss_role_yes')
            .setLabel('Yes')
            .setStyle('SUCCESS')

        const refuse_btn = new MessageButton()
            .setCustomId('boss_role_no')
            .setLabel('No')
            .setStyle('DANGER')

        const btn_row = new MessageActionRow()
            .addComponents(accept_btn) 
            .addComponents(refuse_btn) 

        const embed = new MessageEmbed()
            .setColor('#DBD48E')
            .setTitle('Do you want to get pinged for boss respawns?')
            .setDescription('Then choose the button below!')
            .setThumbnail('https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/1170950/3d81fb0e771088ae3fc76a537c0b6f30c026de87.jpg')

        channel.send({
            embeds: [embed],
            components: [btn_row]
        })
    },

    addUserRole: (member) =>{
        const role = BossRole.__getRole(member)
        if (!role) return;
        member.roles.add(role)
    },

    removeUserRole: (member) =>{
        const role = BossRole.__getRole(member)
        if (!role) return;
        member.roles.remove(role)
    },

    __getRole: (member) =>{
        return member.guild.roles.cache.find(role => role.id === process.env['BOSS_PING_ROLE_ID'].toString())
    }
}