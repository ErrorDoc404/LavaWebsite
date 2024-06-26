const fs = require('fs');

module.exports = (client) => {
    const categories = fs.readdirSync(__dirname + '/../../handlers/commands');
    categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
        const files = fs.readdirSync(__dirname + `/../../handlers/commands/${cat}/`).filter((f) =>
            f.endsWith('.js')
        );
        files.forEach((file) => {
            let cmd = require(__dirname + `/../../handlers/commands/${cat}/` + file);
            if (!cmd.name || !cmd.description || !cmd.SlashCommand) {
                return this.warn(`unable to load command: ${file.split(".")[0]}, Reason: File doesn't had run/name/desciption`);
            }
            let cmdName = cmd.name.toLowerCase();
            client.Commands.set(cmdName, cmd);
            client.logger.commands(`Loaded command '${cmdName}'`);
        })
    });
}