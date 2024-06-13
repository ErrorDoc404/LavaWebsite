module.exports.run = async (client, node, { code, reason }) => {
    client.logger.commands(`Node ${node.options.identifier} disconnected with code ${code} and reason ${reason}`);
};