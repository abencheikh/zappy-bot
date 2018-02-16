/* 
* what happens when bot hears a ZAP message
*/

var sendZap = require('../helpers/zaps.js');

module.exports = function(controller) { 
    controller.hears([':zap:'], 'direct_message, ambient', function(bot, message) {
      var incoming = message.text;
      var mention = incoming.match(/<@([a-zA-Z0-9]+)>/);
      
      sendZap(mention[1], message.user, controller, bot);
    }); 
}