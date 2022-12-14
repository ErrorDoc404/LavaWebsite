const { PermissionsBitField } = require("discord.js");
const client = require("../../");
const api = require("express").Router();

api.get("/", async (req, res) => {
    if (!req.user) return res.send({});
    req.user.guilds.map((guild) => {
        guild.hasPerms = new PermissionsBitField(BigInt(guild.permissions)).has(PermissionsBitField.Flags.ManageGuild, true);
        guild.inGuild = client.guilds.cache.has(guild.id);
        guild.client_id = client.user;
        return guild;
    });
    res.send({ user: req.user });
});

api.get('/guild/cache', async (req, res) => {
    res.send(client.guilds.cache);
});

module.exports = api;