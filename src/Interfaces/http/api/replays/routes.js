const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.postReplayHandler,
        options: {
            auth: 'forumapi_dicoding',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: handler.deleteReplayHandler,
        options: {
            auth: 'forumapi_dicoding',
        }
    },
];

module.exports = routes;
