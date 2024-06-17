const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ping',
    run: async (client, interaction, parms, { MusicDB }) => {
        await interaction.deferReply({ ephemeral: false });

        const all = client.manager.nodes.map(node =>
            `Node ${(node.options.identifier)} Connected` +
            `\nPlayer: ${node.stats.players}` +
            `\nPlaying Players: ${node.stats.playingPlayers}` +
            `\nUptime: ${new Date(node.stats.uptime).toISOString().slice(11, 19)}` +
            `\n\nMemory` +
            `\nReservable Memory: ${Math.round(node.stats.memory.reservable / 1024 / 1024)}mb` +
            `\nUsed Memory: ${Math.round(node.stats.memory.used / 1024 / 1024)}mb` +
            `\nFree Memory: ${Math.round(node.stats.memory.free / 1024 / 1024)}mb` +
            `\nAllocated Memory: ${Math.round(node.stats.memory.allocated / 1024 / 1024)}mb` +
            "\n\nCPU" +
            `\nCores: ${node.stats.cpu.cores}` +
            `\nSystem Load: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` +
            `\nLavalink Load: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`
        ).join('\n\n----------------------------\n');

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Lavalink Node', iconURL: client.user.displayAvatarURL() })
            .setDescription(`\`\`\`${all}\`\`\``)
            .setColor(0x000FF0);

        await interaction.followUp({ embeds: [embed] });
    }
}
