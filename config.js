require('dotenv').config();
const { ActivityType } = require("discord.js");

module.exports = {
    Id: process.env.Discord_ClientID,
    prefix: process.env.PREFIX || '!',
    Admins: ['456130838183280651', '963655683658629150'],
    buildToken: process.env.BUILD_TOKEN || 'build token',
    Token: process.env.TOKEN || 'bot token',
    ExpressServer: true,
    httpPort: process.env.HTTP_PORT || 'need port',
    httpsPort: process.env.HTTPS_PORT || '443',
    CallbackURL: process.env.CALLBACK_URL || '',

    mongooseURL: process.env.MONGOOSE_URL || "",

    RateLimitWindowMS: 15,
    RateLimitDelayAfter: 30,
    MaxUsesPerUser: Infinity,
    RateLimitDelayMs: 100,

    // lavalink server
    lavalink: [
        // {
        //     id: "ryisgood",
        //     host: '149.56.23.207',
        //     port: 1311,
        //     password: 'lalalink',
        //     secure: false,
        // },
        // {
        //     id: "Darren",
        //     host: 'narco.buses.rocks',
        //     port: 2269,
        //     password: 'glasshost1984',
        //     secure: false,
        // },
        {
            id: "lavalink",
            host: 'node1.kartadharta.xyz', //perm host
            port: 3000,
            password: 'kdlavalink',
            secure: false,
        }
    ],

    presence: {
        status: "idle", // online, idle, and dnd(invisible too but it make people think the bot is offline)
        activities: [
            {
                name: "Music", //Status Text
                type: ActivityType.Playing, // PLAYING, WATCHING, LISTENING, STREAMING
            },
        ],
    },

    Spotify: {
        ClientID: process.env.Spotify_ClientID || "", //Spotify Client ID
        ClientSecret: process.env.Spotify_ClientSecret || "", //Spotify Client Secret
    },

    github: {
        repoOwner: "ErrorDoc404",
        repoName: process.env.GITHUB_REPO_NAME || "",
        githubToken: process.env.GITHUB_TOKEN || "",
    },

    stripe: {
        token: process.env.STRIPE_TOKEN
    },

    mail: {
        host: process.env.MAIL_HOST || 'smtp.zoho.in',
        port: 465,
        secure: true, // Set to true if using SSL
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_KEY,
        },
    },

};