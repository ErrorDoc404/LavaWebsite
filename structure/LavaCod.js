const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ConfigFetcher = require('../config');
const { Server } = require("socket.io");
const http = require("http");
const https = require("https");
const fs = require('fs');
const Express = require("express");
const Logger = require("./Logger");
const logger = new Logger();
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");
const BotStats = require("../mongoose/database/schemas/Stats");
const { Manager } = require("erela.js");
const Spotify = require("better-erela.js-spotify").default;
const { default: AppleMusic } = require("better-erela.js-apple");
const mongoose = require('mongoose');
const filters = require("erela.js-filters");
const path = require('path');

class LavaCod extends Client {

    constructor(
        props = {
            partials: [
                Partials.Channel, // for text channel
                Partials.GuildMember, // for guild member
                Partials.User, // for discord user
            ],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
            ],
        }

    ) {
        super(props);

        // Load Config File
        this.config = ConfigFetcher;

        this.musicMessage = [];
        this.language = [];

        this.skipSong = [];
        this.skipBy = [];
        this.twentyFourSeven = [];

        this.SlashCommands = new Collection();
        this.Commands = new Collection();
        this.MusicPlayed = 0;
        this.CommandsRan = 0;
        this.InQueue = 0;
        this.guildQueue = [];
        this.Buttons = new Collection();
        this.invites = new Collection();

        this.LoadButtons();

        var client = this;

        //creating Web portal
        this.server = Express();
        this.http = http.createServer(this.server);
        this.server.use('/', require('../express'));
        this.io = new Server(this.http);
        require('../express/socket')(this.io);


        // Initiate the Manager with some options and listen to some events.
        this.manager = new Manager({
            autoPlay: true,
            // plugins
            plugins: [
                new AppleMusic(),
                new Spotify(),
                new filters(),
            ],
            autoPlay: true,
            retryDelay: this.config.retryDelay,
            retryAmount: this.config.retryAmount,
            // Pass an array of node.
            nodes: this.config.lavalink,
            // A send method to send data to the Discord WebSocket using your library.
            // Getting the shard for the guild and sending the data to the WebSocket.
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });

        this.logger = logger;

        this.config.handlers.forEach((handler) => {
            require(`./handlers/${handler}`)(client);
        });

    }

    log(Text) {
        logger.log(Text);
    }

    warn(Text) {
        logger.warn(Text);
    }

    error(Text) {
        logger.error(Text);
    }

    playSong(song, queueLength) {
        logger.playSong(song, queueLength);
    }

    LoadButtons() {
        fs.readdir('./handlers/buttons/', async (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith('.js')) return;
                const button = require(`../handlers/buttons/${file}`)
                let btnName = file.split('.')[0];
                this.Buttons.set(btnName, button);
                logger.log(`Loaded button '${btnName}'`);
            });
        });
    }

    build() {
        this.warn('Getting Ready....');
        this.login(this.config.Token);
        if (this.config.ExpressServer) {
            this.warn('Server is starting');
            this.log('Server started...');
            this.http.listen(this.config.httpPort, () =>
                this.log(`Web HTTP Server has been started at ${this.config.httpPort}`)
            );
        }

        this.MongooseConnect();
    }

    RegisterSlashCommands() {
        require("./SlashCommand")(this);
    }

    DeRegisterGlobalSlashCommands() {
        require("./DeRegisterSlashGlobalCommands")(this);
    }

    DeRegisterGuildSlashCommands() {
        this.guilds.cache.forEach((guild) => {
            require("./DeRegisterSlashGuildCommands")(this, guild.id);
        });
    }

    MongooseConnect() {
        mongoose.set('strictQuery', true);
        mongoose.connect(this.config.mongooseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(data => {
                this.warn(`Connected to ${data.connection.host}:${data.connection.port} database: ${data.connection.name}`);
            })
            .catch(err => { this.warn(err) });
    }

    GetMusic(GuildID) {
        return new Promise(async (res, rej) => {
            const findGuildConfig = await GuildConfig.findOne({ guildId: GuildID });
            res(findGuildConfig);
        });
    }

    sendEmbed(int, msg, success) {
        const embed = new EmbedBuilder()
            .setColor(success ? 0x00ff00 : 0xff0000) // Green for success, red for failure
            .setDescription(msg);

        // Assuming 'interaction' or 'message' is defined and accessible here
        int.reply({ embeds: [embed] }).catch(err => { this.error(err); });
    }

}

module.exports = LavaCod;