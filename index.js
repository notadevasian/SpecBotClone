const Discord = require("discord.js");
const bot = new Discord.Client();
const token = 'YOURTOKEN'
const prefix = '/';
const rcon = require ("./rcon/app.js")
const SourceQuery = require('sourcequery')
const fs = require('fs');
const request = require('request')
const configdir = './config';
const maxServers = 10;


bot.on('ready', () => {

    console.log('Your bot is now online.')
    bot.user.setActivity('', {type: "WATCHING"})
        .then(presence => console.log(`Activity Set To${presence.activities[0].name}`))
        .catch(console.error);

    bot.user.setStatus('dnd')    
       .then(console.log)
       .catch(console.error); 
})

bot.on ("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.find(ch => ch.name.includes('welcome'));
    const welcomeText = `Welcome <@${member.user.id}> to ${member.guild.name} hope you enjoy our servers`
    if (!welcomeChannel) {
        console.log('Could not find welcome channel... creating one');
        member.guild.createChannel('welcome',{
            type: 'text',
            position: 0,
            topic: 'Welcome to SpectalityServers'
            

        }).then(console.log('Welcome Channel Created')).catch(console.error);
    }
    Promise.resolve(welcomeText).then(function (welcomeText){
        welcomeChannel.send(welcomeText);
    })

})

bot.on ("guildMemberRemove", member => {
    const leaveChannel = member.guild.channels.find(ch => ch.name.includes('goodbye'))
    const goodbyeText = `Goodbye ${member.user.tag}`

    if (!leaveChannel) {
        console.log('Could not find leave channel... creating one');
        member.guild.createChannel('goodbye', {
            type: 'text',
            position: 3,
            topic: 'Leave Channel'
            
        }).then(console.log('Leave Channel Created')).catch(console.error);
    }
    Promise.resolve(goodbyeText).then(function (goodbyeText){
        leaveChannel.send(goodbyeText);
    })

})

// Create dir if not exist
if (!fs.existsSync(configdir)){
    fs.mkdirSync(configdir);
}

// Create config file if not exist
fs.readdir(configdir, (err, files) => {
    try {
        if (files.length < 1 )
        var writeConfig = '{"debug":false,"token":"","apiSite":4,"apiUrl":"https://full uri here","serverIp":"","serverPort":"28015","enableRcon":"0","rconhost":"","rconport":"","rconpass":"","prefix":"!","roles":["Administrator","admins"],"queueMessage":"currently waiting in queue.","updateInterval":"3"}'
        var jsonData = JSON.parse(writeConfig);
        
        fs.writeFile("config/server1.json", JSON.stringify(jsonData, null, 2), 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("Config file created");
        });
    } catch (error) {
        
    }
});

fs.readdir(configdir, (err, files) => {

    for (var i = 1; i <= files.length; i++){
        if (i > maxServers) {
        console.log("Max servers is over " + maxServers)
        console.log("Please verify max servers and try again")
        process.exit()
        }

        // Functions
        function updateActivity() {
            if (apiSite == 1) {
                require("tls").DEFAULT_ECDH_CURVE = "auto"
                request({ url: apiUrl, headers: { json: true, Referer: 'discord-rustserverstatus' }, timeout: 10000 }, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const server = JSON.parse(body)
                        const is_online = server.status
                        if (is_online == "Online") {
                            const players = server.players
                            const maxplayers = server.players_max
                            if (debug) console.log("Updated rust-servers.info")
                            status = `${players}/${maxplayers}`
                            return client.user.setActivity(status, { type: statusType })
                        } else {
                            return client.user.setActivity("Offline")
                        }
                    }
                })
            }
            if (apiSite == 2) {
                request({ url: apiUrl, headers: { Referer: 'discord-rustserverstatus' }, timeout: 10000 }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        const server = JSON.parse(body)
                        const is_online = server.is_online
                        if (is_online == 1) {
                            const players = server.players
                            const maxplayers = server.maxplayers
                            if (debug) console.log("Updated rust-servers.net")
                            let status = `${players}/${maxplayers}`
                            return client.user.setActivity(status, { type: statusType })
                        } else {
                            return client.user.setActivity("Offline")
                        }
                    }
                })
            }
            if (apiSite == 3) {
                require("tls").DEFAULT_ECDH_CURVE = "auto"
                request({ url: apiUrl, headers: { json: true, Referer: 'discord-rustserverstatus' }, timeout: 10000 }, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const jsonData = JSON.parse(body)
                        const server = jsonData.data.attributes
                        const is_online = server.status
                        if (is_online == "online") {
                            const players = server.players
                            const maxplayers = server.maxPlayers
                            const queue = server.details.rust_queued_players
                            let status = `${players}/${maxplayers}`
                            if (typeof queue !== "undefined" && queue != "0") {
                                status += ` (${queue} ${queueMessage})`
                            }
                            if (debug) console.log("Updated from battlemetrics, serverid: " + server.id)
                            return client.user.setActivity(status, { type: statusType })
                        } else {
                            return client.user.setActivity("Offline")
                        }
                    }
                })
            }
            if (apiSite == 4) {
                if (!serverIp || !serverPort) {
                    console.log("You have to configure serverIP/port")
                    process.exit()
                } else {
                    const sq = new SourceQuery(1000) // 1000ms timeout
                    sq.open(serverIp, serverPort)

                    sq.getInfo(function(err, info) {
                        if (err) { return client.user.setActivity("Offline") }
                        else {
                            if (debug) { console.log('Server Info: \nIP: %s\nPort: %s\nName: %s\nPlayers: %s/%s', serverIp, serverPort, info.name, info.players, info.maxplayers) }
                            const players = info.players
                            const maxplayers = info.maxplayers
                            let status = `${players}/${maxplayers}`
                            return client.user.setActivity(status, { type: statusType })
                        }
                    })
                }
            }
        }
        // End Functions

        try {
            var config = require("./config/server"+i+".json");
        } catch (error) {

        }
        const client = new Discord.Client()

        const updateInterval = (1000 * 60) * 3 || (1000 * 60) * process.env.updateInterval || (1000 * 60) * config.updateInterval
        const debug = process.env.debug || config.debug
        const apiUrl = process.env.apiUrl || config.apiUrl
        const apiSite = process.env.apiSite || config.apiSite
        const serverIp = process.env.serverIp || config.serverIp
        const serverPort = process.env.serverPort || config.serverPort
        const enableRcon = process.env.enableRcon || config.enableRcon
        const prefix = process.env.prefix || config.prefix
        const roles = process.env.roles || config.roles
        const queueMessage = process.env.queueMessage || config.queueMessage
        const statusType = process.env.statusType || config.statusType

        client.on("ready", () => {
            console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`)
            updateActivity()
            setInterval(function () {
                updateActivity()
            }, updateInterval)
        })

        if (enableRcon == 1) {
            client.on("message", async message => {
        
                if(message.author.bot) return
                if(message.content.indexOf(prefix) !== 0) return
        
                var args = message.content.slice(prefix.length).trim().split(/ +/g)
                var command = args.shift().toLowerCase()

                if(command === "rcon") {
                    // Checks for discord permission
                    if(!message.member.roles.cache.some(r=>roles.includes(r.name)) )
                        return message.reply("Sorry, you don't have permissions to use this!")

                    var getMessage = args.join(" ")

                    // Rcon message.
                    argumentString = `${getMessage}`
                
                    // Rcon Config
                    rconhost = process.env.rconhost || config.rconhost
                    rconport = process.env.rconport || config.rconport
                    rconpass = process.env.rconpass || config.rconpass
            
                    // Run rcon command.
                    rcon.RconApp(argumentString, rconhost, rconport,rconpass, debug)
                
                    // Send message back to discord that we are trying to relay the command.
                    message.channel.send(`Trying to relay command: ${getMessage}`)
                }
            })
        }
        else if (debug) console.log("Rcon mode disabled")

        client.on("guildCreate", guild => {
        console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
        })

        client.on("guildDelete", guild => {
        console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
        })

        client.on('error', function (error) {
        if (debug) console.log(error)
        })

        process.on('unhandledRejection', error => {
            if (error.code == 'TOKEN_INVALID')
                return console.log("Error: An invalid token was provided.\nYou have maybe added client secret instead of BOT token.\nPlease set BOT token")

            return console.error('Unhandled promise rejection:', error);
        });

       
    }
});



bot.on("message", message => {

    if(message.author.bot) return;

const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLocaleLowerCase();


if(command === 'help') {

    message.reply('If you need help message me directly')
}
if(command === 'staff') {
    message.channel.send('The current staff members online are')
} 

if(command === 'mutehelp') {
    message.reply('Syntax is /mute "Player" "Reason" "1d/1h/1m/1s"')
} 
   
if (command === 'COMMAND1') {
    const Embed = new Discord.RichEmbed() 
        .setColor(0xFF00FF)
        .setTitle('TITLEofEMBRED')
        .setURL('WEBURL')
        .setDescription('DESCRIPTION')
        .setFooter('Spectality Servers')
        .setImage('https://imgur.com/a/ZE9oTRq')
        try {

        message.channel.send(Embed)
    }   catch {

        message.reply(`Sorry <@${message.author.username}> I can not message you`)
    }
       //Example For Command
    if (command === 'rules123') {
        const Embed = new Discord.RichEmbed() 
            .setColor(0xFF00FF)
            .setTitle('Spectality 2x Trio Rules')
            .setURL('https://www.spectalityservers.com/')
            .setDescription('**[US] 2x Trio Rules** \n -Must play in favor of your own Party at ALL times \n -No Raid/Kill Truces are NOT Allowed \n -No more than 3 players at ALL times (Raiding/Roaming/Offline/Online) \n-There is no such thing as "Allies" as they will count as Teammates \n -No giving away bases/Bagging people in \n -No swapping players to replace them (Unless checked with an admin, Doors and TC must be cleared) \n -There is no trading except through Shopfronts, and we encourage players to use Vending Machines to Buy/Sell ')
            .setAuthor(message.author.username)
        try {
    
            message.channel.send(Embed)
        }   catch {
    
            message.reply(`Sorry <@${message.author.username}> I can not message you`)
        }




    

  } else
  if (command === 'ban') {
      const userBan = message.mentions.users.first();

    if (userBan){
        var member = message.guild.member(userBan);

        if(member){
            member.ban({
                reason: 'Rule Breaker.'

            }).then (() => {
                message.reply(`${userBan.tag} was banned from spectality.`)
            })

        }else {
            message.reply('user doesnt exist.');
        }
    } else {
        message.reply('you need to state a user')
     }

  } else
  if (command === 'kick') {
      const memberRemove = message.mentions.users.first();
    if (memberRemove){
        var member = message.guild.member(memberRemove);

        if(member) {
            member.kick('You have been kicked.').then(() => {
                message.reply(`kicked user ${userKick,tag}!`);
            }).catch(err => {
                message.reply('I was not able to kick that user')
                console.log(err);
            })

        } else{
            message.reply('that user is not in the server.')
        }
        
        

    } else {
        message.reply('you need to state the person you want to kick')
    }

  }

 }
})



bot.login(token);