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
    }

}

module.exports = donationFunctions;
