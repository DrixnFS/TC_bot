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
    editOrder: (name, args, channel) =>{
        const title = name.join(' ').trim();

        if(DonationFunctions.current_orders[title]){
            for (let i = 0; i < args.length; i++){
                material = args[i].trim().split(' ');
                material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
                if(!DonationFunctions.current_orders[title]['materials'][material_name]){
                    DonationFunctions.current_orders[title]['materials'][material_name] = {}
                }
                const already_filled = DonationFunctions.current_orders[title]['materials'][material_name]['filled'] ? DonationFunctions.current_orders[title]['materials'][material_name]['filled'] : 0;
                DonationFunctions.current_orders[title]['materials'][material_name] = {
                    'qty': material[1],
                    'is_stack': material[2] && material[2].toLowerCase() == 'yes' ? true : false,
                    'filled': already_filled
                }
            }
            DonationFunctions.current_orders[title]['message'] = DonationFunctions.__createOrderMessage(title, DonationFunctions.current_orders[title]['materials']);
            DonationFunctions.sendDonoMessage(channel);
        } else {
            console.log('user is a moron and edits non existent order!');
            DonationFunctions.sendDonoMessage(channel);
            DonationFunctions.sendErrorMessage(channel, `Cannot edit non existent order: ${title}`);
            return false;
        }
    },

    /**
     * 
     */
    saveDonationIntoFile: () =>{
        const save_obj = {
            'orders': DonationFunctions.current_orders,
            'donors': DonationFunctions.current_donators
        }
        fs.writeFile(`${drixnBot.paths['backup']}/donation_backup.json`, JSON.stringify(save_obj), function(whatever){});
    },

    /**
     * 
     */
    loadBackup: function(client){
        if(fs.existsSync(`${drixnBot.paths['backup']}/donation_backup.json`)){
            try {
                const data = fs.readFileSync(`${drixnBot.paths['backup']}/donation_backup.json`);
                if(!data) return false;
                const backuped_json = JSON.parse(data);
                DonationFunctions.current_orders = backuped_json.orders;
                DonationFunctions.current_donators = backuped_json.donors;
                DonationFunctions.sendDonoMessage(client.channels.get(process.env['GOAL_CHANNEL_ID']));
            } catch (err) {
                    console.error('error when loading backup ', err)
                }
            }
        },

    /**
     * 
     * @param {*} name 
     */
    deleteOrder: (name, channel) =>{
        const title = name.join(' ').trim();
        if(DonationFunctions.current_orders[title]) {
            delete DonationFunctions.current_orders[title]
            DonationFunctions.sendDonoMessage(channel);
        } else {
            DonationFunctions.sendDonoMessage(channel);
            DonationFunctions.sendErrorMessage(channel, `Cannot delete non existent order: ${title}`);
        }
    },

    /**
     * 
     * @param {*} name 
     * @param {*} args 
     */
    doDonate: (name, args, channel) =>{
        const title = name.join(' ').trim();

        if(args.length == 1){
            material = args[0].trim().split(' ');
            material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
            is_stack = material[2] && material[2].toLowerCase() == 'yes' ? true : false;
            user = material[3] ? material[3].toLowerCase()[0].toUpperCase() + material[3].slice(1) : false;

            if(title.length && DonationFunctions.current_orders[title]){
                if(DonationFunctions.current_orders[title]['materials'][material_name]){
                    if(DonationFunctions.current_orders[title]['materials'][material_name]['is_stack'] == is_stack) {
                        DonationFunctions.current_orders[title]['materials'][material_name]['filled'] += parseFloat(material[1]);
                    } else {
                        DonationFunctions.sendDonoMessage(channel);
                        DonationFunctions.sendErrorMessage(channel, `Material ${material_name} donated into order ${title} MUST BE the same type as the Order dictates (stack or no stack)`);
                        return false;
                    }
                } else {
                    DonationFunctions.sendDonoMessage(channel);
                    DonationFunctions.sendErrorMessage(channel, `Material ${material_name} donated into order ${title} is not accepted by the Order`);
                    return false;
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
            DonationFunctions.sendDonoMessage(channel);
        } else {
            console.log('wrong donate input');
            DonationFunctions.sendDonoMessage(channel);
            DonationFunctions.sendErrorMessage(channel, `Donate only accepts one material!`);
        }
    },

    /**
     * 
     * @param {*} name 
     * @param {*} args 
     */
    editDonate: (name, args, channel) =>{
        const user_name = name.join(' ').trim();

        if(args.length == 1){
            material = args[0].trim().split(' ');
            material_name = material[0].toLowerCase()[0].toUpperCase() + material[0].slice(1);
            is_stack = material[2] && material[2].toLowerCase() == 'yes' ? true : false;

            if(user_name && DonationFunctions.current_donators[user_name]) {
                const key = is_stack ? 'stacks' : 'raw';
                if(DonationFunctions.current_donators[user_name][material_name]) {
                    DonationFunctions.current_donators[user_name][material_name][key] = parseFloat(material[1]);
                    DonationFunctions.sendDonoMessage(channel);
                } else {
                    DonationFunctions.sendDonoMessage(channel);
                    DonationFunctions.sendErrorMessage(channel, `Cannot edit Material ${material_name} because ${user_name} have not donated it yet. Use .donate instead`);
                }
            } else {
                console.log('editing non existent user');
                DonationFunctions.sendDonoMessage(channel);
                DonationFunctions.sendErrorMessage(channel, `User ${user_name} is not part of Donation list yet`);
            }
        } else {
            console.log('wrong edit donate input');
            DonationFunctions.sendDonoMessage(channel);
            DonationFunctions.sendErrorMessage(channel, `You can only edit one material!`);
        }
    },

    /**
     * 
     */
    deleteDonate: (name, channel) =>{
        const user_name = name.join(' ').trim();
        if(DonationFunctions.current_donators[user_name]) {
            delete  DonationFunctions.current_donators[user_name]
            DonationFunctions.sendDonoMessage(channel);
        } else {
            DonationFunctions.sendDonoMessage(channel);
            DonationFunctions.sendErrorMessage(channel, `Cannot delete non existent Donator: ${user_name}`);
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

    sendErrorMessage: (channel, string) => {
        channel.send(`\n\`\`\`diff\n- ${string} \`\`\``);
    },

}

module.exports = DonationFunctions;