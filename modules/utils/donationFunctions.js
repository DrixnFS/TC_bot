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

    createOrder: (name, args) =>{
    // .addorder <title> [item, qty] [item, qty] ... .addorder Guild Keep [wood, 50] [stone, 50]
        const title = name.join(' ').trim();
        const materials = {};
        for (let i = 0; i < args.length; i++){
            material = args[i].trim().split(' ');
            materials[material[0]] = {
                'qty': material[1],
                'unit': material[2] ? material[2] : ''
            }
        }

        const message = donationFunctions.__createOrderMessage(title, materials);

        donationFunctions.current_orders[title] = {
            'materials': materials,
            'donations': {},
            'message': message
        }

    },

    /**
     * 
     */
    __createOrderMessage: (title, materials) =>{
        let message = `__${title}__\n`;

        const keys = Object.keys(materials);
        for(let i = 0; i < keys.length; i++){
            message += `${keys[i]}: 0/${materials[keys[i]]['qty']}${materials[keys[i]]['unit'] ? ` ${materials[keys[i]]['unit']}` : ''}\n`;
        }

        return message;
    },

    /**
     * 
     * @param {*} name 
     * @param {*} args 
     */
    editOrder: (name, args) =>{
        const title = name.join(' ').trim();

        if(donationFunctions.current_orders[title]){
            for (let i = 0; i < args.length; i++){
                material = args[i].trim().split(' ');
                donationFunctions.current_orders[title]['materials'][material[0]] = {
                    'qty': material[1],
                    'unit': material[2] ? material[2] : ''
                }
            }
            donationFunctions.current_orders[title]['message'] = donationFunctions.__createOrderMessage(title, donationFunctions.current_orders[title]['materials']);
        } else {
            console.log('user is a moron and edits non existent order!');
            return false;
        }
    },

    /**
     * 
     */
    getDonationMessage: () =>{
        let compiled_message = '';
        compiled_message += `${donationFunctions.order_title}\n`;
        const order_keys = Object.keys(donationFunctions.current_orders);
        for(let i = 0; i < order_keys.length; i++){
            compiled_message += `${donationFunctions.current_orders[order_keys[i]].message}\n`
        }
        compiled_message += `${donationFunctions.donor_title}\n`;
        return compiled_message
    },

    /**
     * 
     */
    sendDonoMessage: (channel) =>{
        BotFunctions.clearChannell(channel);
        channel.send(donationFunctions.getDonationMessage());
    },

}

module.exports = donationFunctions;
