/* istanbul ignore file */

const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

const ServerTestHelper = {
  async getAccessToken() {
    const server = await createServer(container);
    const requestPayload = {
      username: 'test',
      password: 'test',
      fullname: 'Test Account',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: requestPayload.username,
        password: requestPayload.password,
      },
    });

    const { accessToken } = JSON.parse(response.payload).data;

    return accessToken;
  },
};

module.exports = ServerTestHelper;
