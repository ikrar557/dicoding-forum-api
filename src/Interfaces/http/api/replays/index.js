const ReplaysHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'replays',
    version: '1.0.0',
    register: async (server, { container }) => {
        const replaysHandler = new ReplaysHandler(container);
        server.route(routes(replaysHandler));
    },
};
