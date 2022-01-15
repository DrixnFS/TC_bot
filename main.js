//Inicialization of bot's object
require('./.ini.js');

//Inicialization of DrixnGG's bot
require('./private/drixnBot');

const BotFunctions = require('./modules/utils/botFunctions');
const DonationFunctions = require('./modules/utils/donationFunctions.js');

//Backup interval for saving up the list
setInterval(function(){
    BotFunctions.saveListIntoFile('kos_list');
    DonationFunctions.saveDonationIntoFile();
}, 30000);
//600000