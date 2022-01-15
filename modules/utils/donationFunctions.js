const fs = require('fs');

const BotFunctions = require('./botFunctions')


/**
 * whateva boi
 * @namespace
 */
const DonationFunctions = {

    current_orders: {},
    current_donators: {},

    order_title: '\`\`\`fix\nFill Orders:\`\`\`\n',
    donor_title: '\`\`\`fix\nDonors:\`\`\`\n',

    createOrder: (name, args) =>{
        const title = name.join(' ').trim();
        const materials = {};
        for (let i = 0; i < args.length; i++){
            material = args[i].trim().split(' ');
            material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
            materials[material_name] = {
                'qty': material[1],
                'is_stack': material[2] && material[2].toLowerCase() == 'yes' ? true : false,
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
            message += `${keys[i]}: ${materials[keys[i]]['filled']}/${materials[keys[i]]['qty']}${materials[keys[i]]['is_stack'] ? ` Stacks` : ''}\n`;
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
                const already_filled = DonationFunctions.current_orders[title]['materials'][material_name]['filled'] ? DonationFunctions.current_orders[title]['materials'][material_name]['filled'] : 0;
                DonationFunctions.current_orders[title]['materials'][material_name] = {
                    'qty': material[1],
                    'is_stack': material[2] && material[2].toLowerCase() == 'yes' ? true : false,
                    'filled': already_filled
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
            is_stack = material[2] && material[2].toLowerCase() == 'yes' ? true : false;
            user = material[3] ? material[3].toLowerCase()[0].toUpperCase() + material[3].slice(1) : false;

            if(title.length && DonationFunctions.current_orders[title] && DonationFunctions.current_orders[title]['materials'][material_name]){
                if(DonationFunctions.current_orders[title]['materials'][material_name]['is_stack'] == is_stack) {
                    DonationFunctions.current_orders[title]['materials'][material_name]['filled'] += parseFloat(material[1]);
                } else {
                    //TODO: send user message that this wont work cause order expects same type, stack or no stack
                }
                DonationFunctions.__updateOrderMessage(title);
            }

            if(user){
                if(!DonationFunctions.current_donators[user]) DonationFunctions.current_donators[user] = {}
                if(!DonationFunctions.current_donators[user][material_name]) DonationFunctions.current_donators[user][material_name] = {
                    'stacks': 0,
                    'raw': 0
                }

                const key = is_stack ? 'stacks' : 'raw';
                DonationFunctions.current_donators[user][material_name][key] += parseFloat(material[1])
            }

        } else {
            console.log('wrong donate input');
        }
    },

    /**
     * 
     * @param {*} name 
     * @param {*} args 
     */
    editDonate: (name, args) =>{
        const user_name = name.join(' ').trim();

        if(args.length == 1){
            material = args[0].trim().split(' ');
            material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
            is_stack = material[2] && material[2].toLowerCase() == 'yes' ? true : false;

            if(user_name && DonationFunctions.current_donators[user_name]) {
                const key = is_stack ? 'stacks' : 'raw';
                DonationFunctions.current_donators[user_name][material_name][key] = parseFloat(material[1])
            }
        }
    },

    /**
     * 
     */
    deleteDonate: (name) =>{
        const user_name = name.join(' ').trim();
        if(DonationFunctions.current_donators[user_name]) delete  DonationFunctions.current_donators[user_name]
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
                if(DonationFunctions.current_donators[user_keys[i]][material_keys[l]]['stacks'] && DonationFunctions.current_donators[user_keys[i]][material_keys[l]]['stacks'] > 0){
                    compiled_message += `${DonationFunctions.current_donators[user_keys[i]][material_keys[l]]['stacks']} Stacks of ${material_keys[l]}\n`;
                }
                if(DonationFunctions.current_donators[user_keys[i]][material_keys[l]]['raw'] && DonationFunctions.current_donators[user_keys[i]][material_keys[l]]['raw'] > 0) {
                    compiled_message += `${DonationFunctions.current_donators[user_keys[i]][material_keys[l]]['raw']} ${material_keys[l]}\n`;
                }
            }
            compiled_message += '\n';
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