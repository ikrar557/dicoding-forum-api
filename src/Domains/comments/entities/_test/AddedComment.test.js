const AddedComment = require('../AddedComment');

describe('AddedComment domain entity', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-test2024',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'comment-test2024',
      content: 'lorem ipsum dolor sit amet',
      owner: [],
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    const payload = {
      id: 'comment-test2024',
      content: 'lorem ipsum dolor sit amet',
      owner: 'user-123',
    };

    const { id, content, userId, owner } = new AddedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
    expect(owner).toEqual(payload.owner);
  });
});
