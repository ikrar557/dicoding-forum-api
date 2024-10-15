const routes = (handler) => [
  // {
  //     method: 'GET',
  //     path: '/threads',
  //     handler: handler.getThreadByIdHandler,
  // },
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi_dicoding',
    },
  },
];

module.exports = routes;
