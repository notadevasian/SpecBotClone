/*
	Welcome Module for DiscordJS
	Author: Flisher (andre@jmle.net)
    
  * Send private or public welcome message
  * @param  {Bot} bot - The discord.js CLient/bot
  * @param  {object} options - Optional (Custom configuarion options, use @MEMBER to replace by the member mention, @GUILDNAME for the guildname)
  * @return {[type]}         [description]

*/

module.exports = function (bot, options) {

  // Event Handlers
  bot.on('guildMemberAdd', member => {
    const description = {
      name: `discord-welcome`,
      filename: `discord-welcome.js`,
      version: `2.0.2`
    }


    // Check if version is 12, if not, abort
    let DiscordJSversion = require('discord.js').version
    if ( DiscordJSversion.substring(0,2) !== "12" ) console.error(`This version of discord-lobby only run on DiscordJS v12 and up, please run "npm install discord-welcome@1.5.1" to install an DiscordJS v11`)
    if ( DiscordJSversion.substring(0,2) !== "12" ) return

    // Set options
    privatemsg = (options && options.privatemsg) || (options[member.guild.id] && options[member.guild.id].privatemsg) || null;
    publicmsg = (options && options.publicmsg) || (options[member.guild.id] && options[member.guild.id].publicmsg) || null;
    publicchannel = (options && options.publicchannel) || (options[member.guild.id] && options[member.guild.id].publicchannel) || null;


    // ********** CODE FOR PUBLIC MESSAGE **********  
    if (publicmsg && publicchannel) {
      let channel = member.guild.channels.cache.find(val => val.name === publicchannel) || member.guild.channels.cache.get(publicchannel);
      if (!channel) {
        console.log(`Channel "${publicchannel}" not found`);
      } else {
        if (channel.permissionsFor(bot.user).has('SEND_MESSAGES')) {
          // Prepare the Message by replacing the @MEMBER tag to the user mention
          if (typeof publicmsg === "object") {
            // Embed
            embed = publicmsg;
            channel.send({
              embed
            });
          } else {
            msg = publicmsg.replace(`@MEMBER`, `${member.user}`);
            msg = msg.replace(`@GUILDNAME`, `${member.guild.name}`);

            // Send the Message
            channel.send(msg);
          }
        } else {
          console.log(`The Bot doesn't have the permission to send public message to the configured channel "${publicchannel}"`)
        }
      }
    }


    // ********** CODE FOR PRIVATE MESSAGE **********            
    if (privatemsg) {
      msg = publicmsg.replace(`@MEMBER`, `${member.user}`);
      msg = msg.replace(`@GUILDNAME`, `${member.guild.name}`);
      member.send(privatemsg)
    }
  });

  /*
	client.on('guildMemberRemove', member => {
		// Take action when someone leave the server
    });
    */
}