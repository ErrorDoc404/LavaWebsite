const {PermissionsBitField} = require('discord.js');
const client = require("../../");
const api = require("express").Router();
const Stats = require('../../mongoose/database/schemas/Stats');
const { Auth, Administrator, Owner } = require("../Middlewares");


api.get('/', Auth, async (req, res) => {
    try {
        const ownerIds = client.config.Admins;
        const requesterId = req.user ? req.user.discordId : null;

        if (!ownerIds.includes(requesterId)) {
            return res.status(403).send(`Unauthorized. ${ownerIds} -> ${req.user}`);
        }

        // Get an array of all the guilds your bot is in
        const botGuilds = client.guilds.cache.map(guild => {
            return {
                id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                member: guild.members.cache,
            };
        });

        res.send({ botGuilds });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

api.get('/:guildId', Auth, Administrator, async (req, res) => {
    try {
        const guildId = req.params.guildId;

        if (!guildId) {
            return res.status(400).send('Guild ID is required.');
        }

        const guild = client.guilds.cache.get(guildId);

        if (!guild) {
            return res.status(404).send('Guild not found.');
        }

        // Fetch all members of the guild
        await guild.members.fetch();

        const members = await Promise.all(guild.members.cache.map(async member => {
            // Sort roles by position (priority) in descending order
            const sortedRoles = member.roles.cache.sort((a, b) => b.position - a.position);

            const roles = sortedRoles.map(role => {
                return {
                    id: role.id,
                    name: role.name
                };
            });

            // Set level based on role ID
            let level = 0;

            if (roles.some(role => role.id === '1012961673943982152')) {
                level = 4;
            } else if (roles.some(role => role.id === '1051664084774424686')) {
                level = 3;
            } else if (roles.some(role => role.id === '1051662275158741043')) {
                level = 2;
            } else if (roles.some(role => role.id === '1051662258373136471')) {
                level = 1;
            }

            // Construct avatar URL
            const avatarUrl = member.user.avatar ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png` : member.user.defaultAvatarURL;

            // Fetch user's music playback stats
            const userStats = await Stats.findOne({ discordId: member.user.id });

            return {
                id: member.user.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                roles: roles,
                level: level,
                avatarUrl: avatarUrl,
                songsCounter: userStats ? userStats.songsCounter : 0
            };
        }));

        // Sort members based on level in descending order
        members.sort((a, b) => {
            if (b.level !== a.level) {
                return b.level - a.level; // Sort by level in descending order
            }
            return b.songsCounter - a.songsCounter; // Sort by song counter in descending order
        });

        res.send({ guildId, members });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = api;
