const fs = require('fs');

/**
 * whateva boi
 * @namespace
 */
const donationFunctions = {

    order_title: '`Fill Orders:`',
    donor_title: '`Donors:`',

    /**
     * 
     * @param {*} channell 
     */
    sendDonationMessage: (channel) => {
        channel.send(donationFunctions.order_title);
        channel.send(donationFunctions.donor_title);
    },

    createOrder: (name, args) =>{
    // .addorder <title> [item, qty] [item, qty] ... .addorder Guild Keep [wood, 50] [stone, 50]

        console.log('name is:', name.join(' '), ' arguments: ', args)

    }

}

module.exports = donationFunctions;
