/* 
* triggers when bot hears a ZAP message
*/

var constants = require('../helpers/constants.js');
var sendZap = require('../helpers/zaps.js');

module.exports = function(controller) { 
      controller.hears([':'+constants.ZAP_TAG+':'], 'direct_message, ambient', function(bot, message) {
      var incoming = message.text;
      var mention = incoming.match(/<@([a-zA-Z0-9]+)>/);
      
      sendZap(mention[1], message.user, controller, bot);
    }); 
}