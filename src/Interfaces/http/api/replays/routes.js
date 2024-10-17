const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.postReplayHandler,
        options: {
            auth: 'forumapi_dicoding',
        },
    },
];

module.exports = routes;
