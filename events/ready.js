const { Collection } = require('discord.js');
/**
 *
 * @param {import("../library/MusicBot ")} client
 */
module.exports = async (client) => {
  (client.Ready = true),
    client.user.setPresence(client.config.presence);
  client.log("Successfully Logged in as " + client.user.tag);
  client.manager.init(client.user.id);
  // await client.DeRegisterGlobalSlashCommands();
  // await client.DeRegisterGuildSlashCommands();
  await client.RegisterSlashCommands();
  client.guilds.cache.forEach(async (data) => {
    client.skipSong[data.id] = false;
    client.skipBy[data.id] = false;
    client.twentyFourSeven[data.id] = false;
  });
};
