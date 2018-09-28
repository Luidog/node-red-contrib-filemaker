module.exports = function(RED) {
    function create(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.connection = RED.nodes.getNode(config.client);
        node.on("input", (msg) => {
            let record = {}
            record[config.field] = msg
            this.connection.client
                .create(config.layout,record)
                .then(record => node.send(record))
                .catch(error => node.error("create record error", error));
        });
    }
    RED.nodes.registerType("create-record", create);
};
