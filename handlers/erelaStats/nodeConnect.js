const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, node) => {
    client.logger.commands(`Node ${node.options.identifier} connected`);
};