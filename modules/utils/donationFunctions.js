const fs = require('fs');

const BotFunctions = require('./botFunctions')


/**
 * whateva boi
 * @namespace
 */
const DonationFunctions = {

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

        const message = DonationFunctions.__createOrderMessage(title, materials);

        DonationFunctions.current_orders[title] = {
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
        DonationFunctions.current_orders[title]['message'] = DonationFunctions.__createOrderMessage(title, DonationFunctions.current_orders[title]['materials'])
    },

    /**
     * 
     * @param {*} name 
     * @param {*} args 
     */
    editOrder: (name, args) =>{
        const title = name.join(' ').trim();

        if(DonationFunctions.current_orders[title]){
            for (let i = 0; i < args.length; i++){
                material = args[i].trim().split(' ');
                material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
                DonationFunctions.current_orders[title]['materials'][material_name] = {
                    'qty': material[1],
                    'unit': material[2] ? material[2] : ''
                }
            }
            DonationFunctions.current_orders[title]['message'] = DonationFunctions.__createOrderMessage(title, DonationFunctions.current_orders[title]['materials']);
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
        if(DonationFunctions.current_orders[title]) delete DonationFunctions.current_orders[title]
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
            user = material[2] ? material[2].toLowerCase()[0].toUpperCase() + material[2].slice(1) : false;

            if(title.length && DonationFunctions.current_orders[title]){
                DonationFunctions.current_orders[title]['materials'][material_name]['filled'] += parseInt(material[1]);
                // const tmp_donation = DonationFunctions.current_orders[title]['materials'][material_name]['filled'] + material[1];
                // if(tmp_donation <= DonationFunctions.current_orders[title]['materials'][material_name]['qty']){
                //     DonationFunctions.current_orders[title]['materials'][material_name]['filled'] = tmp_donation
                // } else {
                //     DonationFunctions.current_orders[title]['materials'][material_name]['filled'] = DonationFunctions.current_orders[title]['materials'][material_name]['qty']
                // }
                DonationFunctions.__updateOrderMessage(title);
            }

            if(user){
                if(!DonationFunctions.current_donators[user]) DonationFunctions.current_donators[user] = {}
                if(!DonationFunctions.current_donators[user][material_name]) DonationFunctions.current_donators[user][material_name] = 0

                DonationFunctions.current_donators[user][material_name] += parseInt(material[1])
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
        compiled_message += `${DonationFunctions.order_title}\n`;
        const order_keys = Object.keys(DonationFunctions.current_orders);
        for(let i = 0; i < order_keys.length; i++){
            compiled_message += `${DonationFunctions.current_orders[order_keys[i]].message}\n`
        }
        compiled_message += `${DonationFunctions.donor_title}\n`;
        const user_keys = Object.keys(DonationFunctions.current_donators);
        for(let i = 0; i < user_keys.length; i++){
            compiled_message += `__${user_keys[i]}__\n`;
            const material_keys = Object.keys(DonationFunctions.current_donators[user_keys[i]]);
            for(let l =0; l < material_keys.length; l++){
                compiled_message += `${DonationFunctions.current_donators[user_keys[i]][material_keys[l]]} ${material_keys[l]}\n`;
            }
        }
        return compiled_message
    },

    /**
     * 
     */
    sendDonoMessage: (channel) =>{
        BotFunctions.clearChannell(channel);
        channel.send(DonationFunctions.getDonationMessage());
    },

}

module.exports = DonationFunctions;
