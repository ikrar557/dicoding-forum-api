const LikesRepository = require('../LikesRepository');

describe('LikesRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const likesRepository = new LikesRepository();

    await expect(likesRepository.addLikeComment({})).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesRepository.unlikeComment('', '')).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesRepository.getLikeCommentByCommentId('')).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesRepository.verifyCommentIsLiked('', '')).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likesRepository.getCommentLikesForEveryComment([])).rejects.toThrowError('LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
