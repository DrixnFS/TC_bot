const Discord = require('discord.js');
const BotFunctions = require('../modules/utils/botFunctions.js');
const DonationFunctions = require('../modules/utils/donationFunctions.js');

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//setup of process variables
require('dotenv').config({
    path: `${drixnBot.paths.root}/.conf`
}) // read .conf and set environment variables to process.env

//Inicialization of main Bot's config
const config = require(`${drixnBot.paths.private}/config`);

//Gets boss timer messages
const boss_timers = require(`${drixnBot.paths.utils}/MO_boss_embeds.js`)()
const boss_timer_stack = require(`${drixnBot.paths.utils}/MO_boss_stack.js`)

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
    BotFunctions.sendListMessage(client.channels.cache.get(process.env['KOS_CHANNEL_ID']));
    DonationFunctions.loadBackup(client);
    DonationFunctions.sendDonoMessage(client.channels.cache.get(process.env['GOAL_CHANNEL_ID']))

    //MO Boss timers
    const boss_timers_channel = client.channels.cache.get(process.env['BOSS_TIMER_CHANNEL_ID'].toString())
    if (boss_timers_channel){
        boss_timer_stack.createDefaultTimers(boss_timers_channel, boss_timers)

        BotFunctions._deleteMessages(boss_timers_channel);
    }
});

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
    boss_timer_stack.timerBtnCb(interaction.message.embeds[0].title)
    interaction.deferUpdate()
});

client.on("guildCreate", guild => {
    // Bot joined a server
    console.log(`New server joined: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    // Bot removed from a server
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('messageCreate', msg => {
    try{
        // Ignore bot's messages
        if (msg.author.bot) return;
        // Ignores messages without our prefix
        if (msg.content.indexOf(config.prefix) !== 0) return;
        // if user is null for some reason
        if(!msg.member){
            console.log('oh shit buddy, member is null...: ', msg);
            return;
        }

        //check if the current channell is supported, if so saves it if not set null so bot ignores the commands    
        const kos_channel = msg.channel.id === process.env['KOS_CHANNEL_ID'] ? msg.channel : null;
        if(kos_channel){
            if(msg.member.roles.some(r=>process.env['KOS_ACCESS_ROLES'].split(',').includes(r.id))){
                //Gets the actual command user wants to invoke
                const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
                const command = args.shift().toLowerCase();
                console.log(`--KOS-list: Command ${msg.content} was called by ${msg.member.nickname}--`)
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
                kos_channel.send(`> Be gone pleb ${msg.member.user.username}, you have no power here`);
            }
        }
        const donation_channel = msg.channel.id === process.env['GOAL_CHANNEL_ID'] ? msg.channel : null;
        if(donation_channel){
            if(msg.member.roles.some(r=>process.env['GOAL_ACCESS_ROLES'].split(',').includes(r.id))){
                const args = msg.content.slice(config.prefix.length).trim().split(',')
                const sub_args = args.shift().split(/ +/g)
                const command = sub_args.shift().trim().toLowerCase();
                switch (command){
                    case 'addorder':
                        if(!args) break;
                            DonationFunctions.createOrder(sub_args, args);
                            DonationFunctions.sendDonoMessage(donation_channel);
                        break;
                    case 'editorder':
                        if(!args) break;
                            DonationFunctions.editOrder(sub_args, args, donation_channel);
                        break;
                    case 'deleteorder':
                        if(!args) break;
                            DonationFunctions.deleteOrder(sub_args, donation_channel);
                        break;
                    case 'donate':
                        if(!args) break;
                            DonationFunctions.doDonate(sub_args, args, donation_channel);
                        break;
                    case 'editdonate':
                        if(!args) break;
                            DonationFunctions.editDonate(sub_args, args, donation_channel);
                        break;
                    case 'deletedonate':
                        if(!args) break;
                            DonationFunctions.deleteDonate(sub_args, donation_channel);
                        break;
                    default: 
                        console.log(`${msg.author} wanted to call unsupported command ${command}`);
                        break;
                }
            } else {
                BotFunctions._deleteMessages(donation_channel, 1);
                donation_channel.send(`> Be gone pleb ${msg.member.user.username}, you have no power here`);
            }
        }
    } catch(err){
        console.log('ERROR OCCURED -- ', err);
    }
});

client.login(process.env['BOT_TOKEN']);