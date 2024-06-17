module.exports.run = async (client, node, error) => {
    client.logger.error(`Node ${node.options.identifier} had an error: ${error.message}`)
}