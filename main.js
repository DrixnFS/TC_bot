//Inicialization of bot's object
require('./.ini.js');

//Inicialization of DrixnGG's bot
require('./private/drixnBot');

const BotFunctions = require('./modules/utils/botFunctions');

//Backup interval for saving up the list
setInterval(function(){
    BotFunctions.saveListIntoFile('kos_list');
}, 600000);