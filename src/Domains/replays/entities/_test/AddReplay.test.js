const AddReplay = require('../AddReplay');

describe('AddReplay entity', () => {
  it('throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'random replay',
    };

    expect(() => new AddReplay(payload)).toThrowError('ADD_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'random replay',
      commentId: 3.14323,
      userId: true,
      threadId: true,
    };

    expect(() => new AddReplay(payload)).toThrowError('ADD_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('create AddReplay object correctly', () => {
    const payload = {
      content: 'random replay',
      commentId: 'comment-test2024',
      userId: 'user-123',
      threadId: 'thread-557',
    };

    const addReplay = new AddReplay(payload);

    expect(addReplay.content).toEqual(payload.content);
    expect(addReplay.commentId).toEqual(payload.commentId);
    expect(addReplay.userId).toEqual(payload.userId);
    expect(addReplay.threadId).toEqual(payload.threadId);
  });
});
