const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
  name: "setup",
  description: "Setup your music channel",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  category: "settings",
  SlashCommand: {
    options: [
      {
        name: "channel",
        description: "Select channel to setup music",
        type: 7,
        required: true,
      },
    ],
    /**
     * Command execution function.
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { MusicDB }) => {
      // Check if the user has the necessary permissions
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return interaction.reply("You don't have the Manage Server permission to run this command.").catch(err => {
          client.error(err);
        });
      }

      const musicChannel = args.channel;
      if (!musicChannel) {
        // If channel is not provided, prompt the user to provide one
        return interaction.reply("Please provide a valid channel to set up music.").catch(err => {
          client.error(err);
        });
      }

      // Check if the bot has permission to send messages in the music channel
      if (!interaction.guild.members.me.permissionsIn(musicChannel).has(PermissionsBitField.Flags.ViewChannel) || !interaction.guild.members.me.permissionsIn(musicChannel).has(PermissionsBitField.Flags.SendMessages)) {
        return interaction.reply("I don't have permissions to send messages in that channel.").catch(err => {
          client.error(err);
        });
      }

      // Inform user that setup is in progress
      interaction.reply({ content: `Setup complete: Please wait 5 sec...` }).catch(err => {
        client.error(err);
      });

      // Check if there's an existing record for the guild
      const hasRecord = await GuildConfig.findOne({ guildId: interaction.guildId });

      if (hasRecord) {
        // If there's an existing record, delete it
        await GuildConfig.deleteOne({ guildId: interaction.guildId });
      }

      // Delay for 5 seconds
      await delay(5);

      // Embed message for music setup
      const embed = {
        title: `🎵 Vibing Music 🎵`,
        description: `Welcome to Version 3 - the Lava Cod Update Extravaganza, where every letter of the alphabet ignites innovation and sets sail for new horizons!\n\n Please Join our Discord [Invite Link](https://discord.gg/jQaMbSSJtV)`,
        color: 0xd43790,
        image: {
          url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
        },
        thumbnail: {
          url: '',
        },
        footer: {
          text: `${client.user.username} Music`,
          iconURL: client.user.avatarURL() ? client.user.avatarURL() : null,
        },
      };

      // Action row for buttons
      const row1 = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId('pause')
          .setLabel('⏸️ Pause')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('skip')
          .setLabel('⏭️ Skip')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('clear')
          .setLabel('🗑️ Clear')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('⏹️ Stop')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('fix')
          .setLabel('⚒️ Repair')
          .setStyle(ButtonStyle.Secondary),
      ]);

      const row2 = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId('shuffle')
          .setLabel('🔀 Shuffle')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('grab')
          .setLabel('🎵 Grab')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('playlist')
          .setLabel('📜 Playlist')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('loop')
          .setLabel('🔁 Loop')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('nowplaying')
          .setLabel('🎶 Now Playing')
          .setStyle(ButtonStyle.Secondary),
      ]);

      try {
        // If the bot has permission, proceed with sending the message
        musicChannel.send({ content: `checking` }).then(async (data) => { await data.delete(); }).catch(err => { client.error(err); });
      } catch (e) {
        // Handle other errors
        interaction.editReply({ content: `**An error occurred while processing your request. Please try again later.**` }).catch(err => { client.error(err); });
        return client.error(e);
      }

      // Send the setup message with buttons
      musicChannel.send({ content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or URL here.`, embeds: [embed], components: [row1, row2] })
        .then(async (data) => {
          // Update database with music channel and message IDs
          const channelId = musicChannel.id;
          const messageId = data.id;
          await GuildConfig.findOneAndUpdate(
            { guildId: MusicDB.guildId },
            {
              musicChannelId: channelId,
              musicMessageId: messageId
            },
            { upsert: true }
          );
        })
        .then(() => {
          // Inform user about setup completion
          client.log(interaction.guild.name);
          interaction.editReply({ content: `**Setup complete in ${interaction.guild.name}**` }).then(async (data) => { await delay(5); await data.delete(); }).catch(err => { client.error(err); });
          client.log(`Setup complete in ${interaction.guild.id}`);
        })
        .catch(err => {
          client.error(err);
        });
    },
  },
};

// Function to delay execution
function delay(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}
