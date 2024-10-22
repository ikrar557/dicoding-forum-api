const DetailThread = require('../DetailThread');

describe('DetailThread entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'random-thread-id',
      title: 'random title thread',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'random-thread-id',
      title: 12345656,
      body: true,
      date: [],
      username: {},
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    const payload = {
      id: 'random-thread-id',
      title: 'random thread title',
      body: 'random body thread',
      date: '2021-08-08T07:59:57.000Z',
      username: 'john doe',
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
  });
});
