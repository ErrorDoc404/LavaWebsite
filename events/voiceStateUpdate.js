module.exports = async (client, oldState, newState) => {
    try {
        let countMember = 0;
        let state = 'old';

        if (oldState.channel) {
            countMember = await oldState.channel.members.size;
            state = 'old';
        }
        if (newState.channel) {
            countMember = await newState.channel.members.size;
            state = 'new';
        }

        if (!countMember) return;

        if (countMember === 1 && state === 'old') {
            const player = await client.manager.get(oldState.guild.id);
            if (player && !player.paused) {
                player.pause(true);
                console.log(`Music paused because the user is alone in the voice channel.`);
            }
        }

        if (countMember > 1 && state === 'new') {
            const player = await client.manager.get(newState.guild.id);
            if (player && player.paused) {
                player.pause(false);
                console.log(`Welcome back user will start playing again for you.`);
            }
        }

        console.log(countMember);
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
};
