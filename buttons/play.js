const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: 'play',
  run: async (client, interaction, parms) => {
    const player = await client.manager.get(interaction.guildId);
    console.log(player);
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    if (!player) return interaction.reply({content: `❌ | **Nothing in Queue to play right now...**`}).catch(err => {client.error(err)});
    if (!member.voice.channel) return interaction.reply({content: `❌ | **You must be in a voice channel to use this Button!**`}).catch(err => {client.error(err)});
    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return interaction.reply({content: `❌ | **You must be in the same voice channel as me to use this Button!**`}).catch(err => {client.error(err)});
    if (player.playing) return interaction.reply({content: `❌ | **Music is already playing!**`}).catch(err => {client.error(err)});
    player.pause(false);
    if(!player.voiceState) player.connect();

    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId('pause')
        .setLabel('⏸️ Pause')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('skip')
        .setLabel('⏭️ Skip')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('loop')
        .setLabel('🔁 Loop')
        .setStyle('DANGER'),
      new MessageButton()
        .setCustomId('stop')
        .setLabel('⏹️ Stop')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('fix')
        .setLabel('⚒️ Repair')
        .setStyle('SECONDARY'),
    ]);

    const row1 = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId('summon')
        .setLabel('⚡ Summon')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('queuelist')
        .setLabel('🧾 Queue List')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('clear')
        .setLabel('🗑️ Clear')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('grab')
        .setLabel('🎣 Grab')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('stats')
        .setLabel('👾 Stats')
        .setStyle('SECONDARY'),
    ]);

    client.musicMessage[interaction.guildId].edit({components: [row, row1]});
    return interaction.reply({content: `✅ | Music Resume`}).catch(err => {client.error(err)});
  }
}
