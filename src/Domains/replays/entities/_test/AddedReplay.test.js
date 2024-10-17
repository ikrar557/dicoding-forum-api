const AddedReplay = require('../AddedReplay');

describe('AddedReplay entity', () => {
  it('throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'replay-data999',
    };

    expect(() => new AddedReplay(payload)).toThrowError('ADDED_REPLAY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      content: [],
      owner: 3.14,
    };

    expect(() => new AddedReplay(payload)).toThrowError('ADDED_REPLAY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('create addedReplayy object correctly', () => {
    const payload = {
      id: 'replay-data999',
      content: 'random replay',
      owner: 'user-123',
    };

    const addedReplay = new AddedReplay(payload);

    expect(addedReplay.id).toEqual(payload.id);
    expect(addedReplay.content).toEqual(payload.content);
    expect(addedReplay.owner).toEqual(payload.owner);
  });
});
