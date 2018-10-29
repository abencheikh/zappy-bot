/*
* Helper function to add zaps
*/

var constants = require('../helpers/constants.js');

module.exports = function(giftedUserID, senderID, controller, bot) {
  if (giftedUserID != senderID) {
      var nbZap = 0;

      controller.storage.users.get(giftedUserID, function(err, user_data) {
        if (!err)
          nbZap = user_data.zaps;

        controller.storage.users.save({id: giftedUserID, zaps: nbZap + 1});
        
        if (nbZap == 0) {
          bot.say( {
            text: `<@${senderID}> vient de vous envoyer un :${constants.ZAP_TAG}: ! C'est une manière de vous dire merci pour l'aide, le soutien ou la bonne humeur que vous apportez !\n Vous pouvez faire de même en écrivant :${constants.ZAP_TAG}: ainsi que @user dans le même message, n'hésitez pas!`,
            channel: giftedUserID
          });
        }
      });
  }
}