const { PermissionsBitField } = require('discord.js');

module.exports = async (client, message) => {
  let MusicDB = await client.GetMusic(message.guild.id);
  if (!MusicDB) return;
  if (!MusicDB.musicChannelId) return;
  if (message.channel.id == MusicDB.musicChannelId) {
    if (message.author.bot) {
      try {
        setTimeout(() => message.delete(), 3000);
      } catch (e) {
        message.channel.send(`Error: ${e}`);
      }
    } else {
      let botPerms = message.guild.members.me.permissionsIn(message.channel);
      if(!botPerms.has(PermissionsBitField.Flags.ManageMessages))
        return message.reply(`Error: Missing Manage Messages Permission to run this command`).catch(err => { client.error(err) });
      try {
        message.delete();
      } catch (e) {
        message.channel.send(`Error: ${e}`);
      }
      const play = client.Commands.get('play');
      play.run(client, message, { MusicDB });
    }
    // const msg = await message.channel.messages.fetch(MusicDB.musicMessageId);
  }
};
