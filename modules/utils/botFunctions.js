const fs = require('fs');

/**
 * 
 * @namespace
 */
const BotFunctions = {

    /**
     * 
     */
    help_message: `\`\`\`fix\n*Talus Confederation KOS list HELP*\n\nDISCLAIMER: THIS CHANNEL IS NOT FOR CHAT, ONLY USE COMMANDS TO UPDATE THE LIST\n\nCommands:
    \n.addToKos <name> <status> <guild>\n.editInKos <index> <name> <status> <guild>\n.removeFromKos <index> ... <index>\n
    FAQ:\n 1. Every command is case insensitive, so it doesnt matter how you type it, just the words must be correct
    \n 2. Index means number you see before the KOS person's name
    \n 3. Every parameter for the commands is optional but if you wanna edit <guild> for example, you must type all the previous parameters
    \n 4. Line that starts with + and is green means player is BLUE. Line starting with - and is red means player is RED
    \n 5. For parameter status you can type 'yes' or 'y' if player is red, if he is blue just type 'no' or 'n'
    \n 6. You can also use 'red' as status for red players and 'blue' status for blue players
    \n Example: .addtokos Peaceleaf red TC
    \n©DrixnGG & Peaceleaf 2021
    \n Drixn: We found an error in backup system, bot has been updated and the issue was fixed and made sure its never gonna happend. Sorry for the inconvenience\`\`\``,

    /**
     * Session list of all KOS big bois, one big array
     */
    kos_list: [],

    /**
     * Adds data to the list
     * @param {*} list 
     * @param {*} data 
     */
    addToList: function(list, data){
        if(!list || !data) return false;

        let name = data[0];
        let status = data[1] || false;
        let guild = data[2] || 'none';

        if(status){
            status = status == 'n' || status == 'no' || status == 'blue' ? false : true; 
        }

        let item = {
            'name' : name,
            'status': status,
            'guild': guild
        };

        BotFunctions[list].push(item);
    },

    /**
     * 
     * @param {*} list 
     * @param {*} data 
     */
    editInList: function(list, data){
        if(!list || !data) return false;

        let index = data[0] - 1;
        let name = data[1] || null;
        let status = data[2] || null;
        let guild = data[3] || null;

        let item = BotFunctions[list][index];
        if(name) item.name = name;
        if(status) item.status = status == 'no' || status == 'n'|| status == 'blue' ? false : true;
        if(guild) item.guild = guild;
        BotFunctions[list][index] = item;
    },

    /**
     * 
     * @param {*} list 
     * @param {*} data 
     * @returns 
     */
    removeFromList: function(list, data){
        if(!list || !data) return false;

        for(let i = 0; i < data.length; i++){
            if(!parseInt(data[i]) || !BotFunctions[list][data[i] - 1]) return false;

            BotFunctions[list].splice(data[i] - 1, 1);
        }
    },

    /**
     * 
     * @param {*} channell 
     */
    clearChannell: async function(channel){
        if(!channel) return false;

        BotFunctions._deleteMessages(channel);
    },

    /**
     * 
     */
    sendListMessage: function(channel){
        BotFunctions.clearChannell(channel);
        channel.send(BotFunctions.help_message);
        channel.send(BotFunctions.getIndexedList('kos_list'));
    },

    /**
     * 
     * @param {*} channel 
     */
    _deleteMessages: async function(channel, limit = 100){
        channel.fetchMessages({limit: limit}).then(messages =>{
            if(messages.size > 100){
                channel.bulkDelete(messages);
                BotFunctions._deleteMessages(channel);
            } else {
                channel.bulkDelete(messages);
            }
        });
    },

    /**
     * 
     */
    loadBackup: function(client){
        if(fs.existsSync(`${drixnBot.paths['backup']}/kos_list_backup.txt`)){
            try {
                const data = fs.readFileSync(`${drixnBot.paths['backup']}/kos_list_backup.txt`, 'utf8');
                if(!data) return false;
                let arr = data.split('|');
                let proper_arr = arr.map(item => {return JSON.parse(item)});
                BotFunctions.kos_list = proper_arr;
                BotFunctions.sendListMessage(client.channels.get(process.env['KOS_CHANNEL_ID']));
              } catch (err) {
                console.error('error when loading backup ', err)
              }
        }
    },

    /**
     * 
     */
    saveListIntoFile: function(list){
        let arr = BotFunctions[list].map(item => {return JSON.stringify(item)});
        if(arr.length){
            let string = arr.join('|');
            fs.writeFile(`${drixnBot.paths['backup']}/kos_list_backup.txt`, string, function(whatever){});
        }
    },

    /**
     * 
     * @param {*} list 
     */
    getIndexedList: function(list){
        if(!list) return false;

        var res_string = "```diff\n**Talus Confederation KOS list**\n\n";
        for(let i = 0; i < BotFunctions[list].length; i++){
            let status = BotFunctions[list][i].status ? '-' : '+';
            let string = `${status} ${i+1}. ${BotFunctions[list][i].name} Guild: ${BotFunctions[list][i].guild}\n`;
            res_string += string;
        }
        res_string += "```";

        return res_string;
    }




}

module.exports = BotFunctions;