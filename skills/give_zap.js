/* 
* what happens when bot hears a ZAP message
*/

module.exports = function(controller) { 
    controller.hears([':zap:'], 'direct_message, ambient', function(bot, message) {
      var incoming = message.text;
      var mention = incoming.match(/<@([a-zA-Z0-9]+)>/);
      
      if (mention && mention[1] != message.user) {
          console.log("inside")
          var giftedUserID = mention[1];
          var nbZap = 0;
        
          controller.storage.users.get(giftedUserID, function(err, user_data) {
            if (!err) nbZap = user_data.zaps;
          });
        
          controller.storage.users.save({id: giftedUserID, zaps: nbZap + 1});
        }
    }); 
}