const fs = require('fs');

const BotFunctions = require('./botFunctions')


/**
 * whateva boi
 * @namespace
 */
const donationFunctions = {

    current_orders: {},

    order_title: '`Fill Orders:`\n',
    donor_title: '`Donors:`\n',

    /**
     * 
     * @param {*} channell 
     */
    sendTitleMessage: (channel) => {
        channel.send(donationFunctions.order_title);
    },

    sendDonorMessage: (channel) => {
        channel.send(donationFunctions.donor_title);
    },

    createOrder: (name, args) =>{
    // .addorder <title> [item, qty] [item, qty] ... .addorder Guild Keep [wood, 50] [stone, 50]
        const title = name.join(' ').trim();
        const materials = {};
        for (let i = 0; i < args.length; i++){
            material = args[i].trim().split(' ');
            materials[material[0]] = {
                'qty': material[1],
                'unit': material[2] ? material[2] : False
            }
        }

        let message = `__${title}__\n`;
        const keys = Object.keys(materials);
        for(let i = 0; i < keys.length; i++){
            message += `${keys[i]}: 0/${materials[keys[i]]['qty']}${materials[keys[i]]['unit'] ? materials[keys[i]]['unit'] : ''}\n`;
        }

        donationFunctions.current_orders[title] = {
            'materials': materials,
            'donations': {},
            'message': message
        }

    },

    /**
     * 
     */
    getOrderMessages: () =>{
        let compiled_message = '';
        const order_keys = Object.keys(donationFunctions.current_orders);
        for(let i = 0; i < order_keys.length; i++){
            compiled_message += `${donationFunctions.current_orders[order_keys[i]].message}\n`
        }
        return compiled_message
    },

    /**
     * 
     */
    sendDonoMessage: (channel) =>{
        BotFunctions.clearChannell(channel);
        donationFunctions.sendTitleMessage(channel)
        channel.send(donationFunctions.getOrderMessages());
        donationFunctions.sendDonoMessage(channel)
    },

}

module.exports = donationFunctions;
