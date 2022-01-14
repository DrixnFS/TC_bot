const fs = require('fs');

const BotFunctions = require('./botFunctions')


/**
 * whateva boi
 * @namespace
 */
const donationFunctions = {

    current_orders: {},
    current_donators: {},

    order_title: '`Fill Orders:`\n',
    donor_title: '`Donors:`\n',

    createOrder: (name, args) =>{
        const title = name.join(' ').trim();
        const materials = {};
        for (let i = 0; i < args.length; i++){
            material = args[i].trim().split(' ');
            material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
            materials[material_name] = {
                'qty': material[1],
                'unit': material[2] ? material[2] : '',
                'filled': 0
            }
        }

        const message = donationFunctions.__createOrderMessage(title, materials);

        donationFunctions.current_orders[title] = {
            'materials': materials,
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
            message += `${keys[i]}: ${materials[keys[i]]['filled']}/${materials[keys[i]]['qty']}${materials[keys[i]]['unit'] ? ` ${materials[keys[i]]['unit']}` : ''}\n`;
        }

        return message;
    },

    /**
     * 
     * @param {*} title 
     */
    __updateOrderMessage: (title) =>{
        donationFunctions.current_orders[title]['message'] = donationFunctions.__createOrderMessage(title, donationFunctions.current_orders[title]['materials'])
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
                material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
                donationFunctions.current_orders[title]['materials'][material_name] = {
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
     * @param {*} name 
     */
    deleteOrder: (name) =>{
        const title = name.join(' ').trim();
        if(donationFunctions.current_orders[title]) delete donationFunctions.current_orders[title]
    },

    /**
     * 
     * @param {*} name 
     * @param {*} args 
     */
    doDonate: (name, args) =>{
        const title = name.join(' ').trim();

        if(args.length == 1){
            material = args[0].trim().split(' ');
            material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
            user = material[2] ? material[2].toLowerCase()[2].toUpperCase() + material[2].slice(1) : false;

            if(title.length && donationFunctions.current_orders[title]){
                donationFunctions.current_orders[title]['materials'][material_name]['filled'] += material[1];
                // const tmp_donation = donationFunctions.current_orders[title]['materials'][material_name]['filled'] + material[1];
                // if(tmp_donation <= donationFunctions.current_orders[title]['materials'][material_name]['qty']){
                //     donationFunctions.current_orders[title]['materials'][material_name]['filled'] = tmp_donation
                // } else {
                //     donationFunctions.current_orders[title]['materials'][material_name]['filled'] = donationFunctions.current_orders[title]['materials'][material_name]['qty']
                // }
                donationFunctions.__updateOrderMessage(title);
            }

            if(user){
                if(!donationFunctions.current_donators[user]) donationFunctions.current_donators[user] = {}
                if(!donationFunctions.current_donators[user][material_name]) donationFunctions.current_donators[user][material_name] = 0

                donationFunctions.current_donators[user][material_name] += material[1]
            }

        } else {
            console.log('wrong donate input');
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
        const user_keys = Object.keys(donationFunctions.current_donators);
        for(let i = 0; i < user_keys.length; i++){
            compiled_message += `\n__${user}__\n`;
            const material_keys = Object.keys(donationFunctions.current_donators[user_keys]);
            for(let l =0; l < material_keys.length; l++){
                compiled_message += `${donationFunctions.current_donators[user_keys][material_keys[l]]} ${material_keys[l]}\n`;
            }
        }
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
