<p align="center"><a href="https://nodei.co/npm/discord-welcome/"><img src="https://nodei.co/npm/discord-welcome.png"></a></p>

# discordjs-welcome
An extremely simple module that perform private or public welcome messages for Discord.js v12
Please use "npm i discord-welcome@1.5.1 discord.js-v11" to install a Discord.js v11 compatible version.

## Installation
This module assumes you already have a basic [Discord.js](https://discord.js.org/#/) bot setup.
Simply type the following command to install the module and it depedencies.
```
npm i discord-welcome
``` 


Once you've done this, setting the module will be very easy.
And you can follow the code  below to get started!

###Single-Server Usage (no server ID required in the configuration)
```js
const Welcome = require("discord-welcome");

Welcome(bot, {
	privatemsg : "Default message, welcome anyway",
	publicmsg : "Default Public Message where you can flag use @MEMBER to mention the newcomer",
	publicchannel : "channel name or id"
	})
});
```
###Multi-Servers Usage 

```js
const Welcome = require("discord-welcome");

Welcome(client, {
	"numericserverid1": {
		privatemsg : "Default message, welcome anyway",
		publicmsg : "Default Public Message where you can flag use @MEMBER to mention the newcomer",
		publicchannel : "channel name or id"
	},
	"numericserverid2": {
		privatemsg : "Second Server default message",
		publicmsg : "Welcome on the second server",
		publicchannel : "channel name or id"
	}
})
```

You can comment the private or the public variable to disable the feature.

##Caveat:
-If you have a named channel that match a channel ID, the named channel will be used, shouldn't really happen...
-Embed doesn't handle @tag replacement yet
-Multi-Servers configuration require to know Server ID

###English:
This module was initialy coded for the Bucherons.ca gamers community and the Star Citizen Organization "Gardiens du LYS".

###Français:
Ce module a initiallement été conçu pour la communauté de gamers Bucherons.ca, la communauté gaming pour adultes au Québec, et l'organisation des Gardiens du LYS dans Star Citizen.  
  
Liens:  https://www.bucherons.ca et https://www.gardiensdulys.com  

##Support:
You can reach me via my Discord Development Server at https://discord.gg/Tmtjkwz

###History:  
2.0.2 Initial version that support DiscordJS v12, v11 tagged and documented  
1.5.1 Added reference to GitHub repository, last V11 compatible version, install with "npm i discord-welcome@1.5.1 discord.js-v11"  