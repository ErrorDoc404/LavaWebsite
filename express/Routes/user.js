const { PermissionsBitField } = require("discord.js");
const client = require("../../");
const { Auth } = require("../Middlewares");
const api = require("express").Router();

/**
 * Get user information and check guild permissions
 */
api.get("/", Auth, async (req, res) => {
    try {
        if (!req.user) {
            // Return empty object if there is no authenticated user
            return res.send({});
        }

        // Update guild information for the user
        req.user.guilds.map((guild) => {
            guild.hasPerms = new PermissionsBitField(BigInt(guild.permissions)).has(
                PermissionsBitField.Flags.ManageGuild,
                true
            );
            guild.inGuild = client.guilds.cache.has(guild.id);
            guild.client_id = client.user;

            // Get member count from the guild cache (assuming you have the member counts in the cache)
            const cachedGuild = client.guilds.cache.get(guild.id);
            if (cachedGuild) {
                guild.memberCount = cachedGuild.memberCount;
            } else {
                guild.memberCount = 0; // Guild not found in cache, set member count to 0
            }

            return guild;
        });

        // Send user information as response
        res.send({ user: req.user });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

/**
 * Get guild cache information
 */
api.get('/guild/cache', async (req, res) => {
    try {
        // Send guild cache information as response
        res.send(client.guilds.cache);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

api.get('/authUser', async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).send(req.user);
        } else {
            return res.status(403).send(false);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = api;