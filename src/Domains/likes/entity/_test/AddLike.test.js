const AddLikes = require('../AddLike');

describe('AddLikes entity', () => {
  it('throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-test2024',
    };

    expect(() => new AddLikes(payload)).toThrowError('ADD_LIKES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throw error when payload did not meet data type specification', () => {
    const payload = {
      commentId: 'comment-test2024',
      userId: true,
      threadId: 3.14,
    };

    expect(() => new AddLikes(payload)).toThrowError('ADD_LIKES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddLikes object correctly', () => {
    const payload = {
      commentId: 'comment-test2024',
      userId: 'user-123',
      threadId: 'thread-557',
    };

    const { userId, threadId, commentId } = new AddLikes(payload);

    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
  });
});
