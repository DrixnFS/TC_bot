const Discord = require('discord.js');
const BotFunctions = require('../modules/utils/botFunctions.js');
const client = new Discord.Client();


//setup of process variables
require('dotenv').config({
    path: `${drixnBot.paths.root}/.conf`
}) // read .conf and set environment variables to process.env

//Inicialization of main Bot's config
const config = require(`${drixnBot.paths.private}/config`);

client.on("ready", () => {
    // Bot Inicialization
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`);
    client.user.setPresence({
        game: {
            name: 'Keep Deed',
            type: 'TRANSPORTING'
        }
    });
    //Load backup data
    BotFunctions.loadBackup(client);
});


client.on("guildCreate", guild => {
    // Bot joined a server
    console.log(`New server joined: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    // Bot removed from a server
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('message', msg => {
    try{
        // Ignore bot's messages
        if (msg.author.bot) return;
        // Ignores messages without our prefix
        if (msg.content.indexOf(config.prefix) !== 0) return;
        //check if the current channell is supported, if so saves it if not set null so bot ignores the commands    
        const kos_channel = msg.channel.id === process.env['KOS_CHANNEL_ID'] ? msg.channel : null;
        if(kos_channel){
            if(msg.member.roles.some(r=>process.env['KOS_ACCESS_ROLES'].split(',').includes(r.id))){
                //Gets the actual command user wants to invoke
                const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();
                switch (command) {
                    case 'addtokos':
                        if(!args) break;
                            BotFunctions.addToList('kos_list', args);
                            BotFunctions.sendListMessage(kos_channel);
                        break;
                    case 'editinkos':
                        if(!args) break;
                            BotFunctions.editInList('kos_list', args);
                            BotFunctions.sendListMessage(kos_channel);
                        break;
                    case 'removefromkos':
                            if(!args) break;
                            BotFunctions.removeFromList('kos_list', args);
                            BotFunctions.sendListMessage(kos_channel);
                        break;
                    default:
                        console.log(`${msg.author} wanted to call unsupported command ${command}`);
                        break;
                }
            } else {
                BotFunctions._deleteMessages(kos_channel, 1);
                channel.send(`> Be gone pleb ${msg.member.user.username}, you have no power here`);
            }
        }
    } catch(err){
        console.log('ERROR OCCURED -- ', err);
    }
});

client.login(process.env['BOT_TOKEN']);
