const { Client, Intents } = require('discord.js');
const fs = require('fs');
const fetch = require('cross-fetch');
const config = require('../config.json');
const execSync = require('child_process').execSync;
const Downloader = require("nodejs-file-downloader");

var savedFileName;
var prefixxx = '+';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: [
        "CHANNEL"
    ]
});

client.on('ready', () => {
    console.log('decompiler is running');
    client.user.setActivity(prefixxx+'decompile <LUAC>', { type: 'WATCHING' });
});


client.on('messageCreate', (msg) => {

    if (msg.content.startsWith(prefixxx+'decompile')) {
        if (msg.attachments.size > 0) {
            let sendMessage = msg.content.substring(11);

            console.log("\nStarted!")
            console.log(msg.attachments.first().url);
            
            (async () => {
                const downloader = new Downloader({
                  url: msg.attachments.first().url,
                  directory: "./luacFiles",
                  onBeforeSave: (deducedName) => {
                    savedFileName = `${deducedName}`;
                    console.log(`Current Luac: ${deducedName}`);
                  },
                });

                try {
                  await downloader.download();
                } catch (error) {
                  console.log("Download failed", error);
                  msg.channel.send('big fail! try again or dm the owner');
                }

                // DECOMPILER SETTINGS
                msg.channel.send('Started decompiling with unluac...');
                console.log('decompiling with unluac...')
                decompile("unluac")
                msg.channel.send({
                    content: "Finished decompiling, if its wrong please contact to the owner.",
                    files: ['output.lua']
                });
                console.log('done')
		//execSync("echo -- EasterEgg > output.lua");

            })(); // async ending

        } else {
            msg.channel.send('b-baka! there is no file or argument, dont forget to send your luac file :)\n\nNeed help? try using **-help**');
        }
    }

    if (msg.content.startsWith(prefixxx+'help')) {
        msg.channel.send('Send me a file to decompile!\n\n*** -> Usage:***\n **-decompile <LUAC>**')
    }
});


async function decompile(setting) { // Function that uses child_process to run unluac LOL

// You can use UnluacNET, it has a better output, but it its not working  sometimes


    if (setting == 'unluac') {
        execSync('java -jar unluac.jar luacFiles/'+savedFileName+' > temp.txt');
        execSync('more +0 temp.txt > output.lua');

        execSync("echo --[[ > temp.txt");
        execSync("echo      lua decompiler bot >> temp.txt");
        execSync("echo ]]-- >> temp.txt");
        execSync('type output.lua >> temp.txt');
        execSync('type temp.txt > output.lua');
		
        execSync('del temp.txt');
	execSync('del luacFiles\\'+savedFileName)
    }

    //var text = fs.readFileSync('outputCount.txt')
    //console.log(text)

    return;
};

client.login(config.token);