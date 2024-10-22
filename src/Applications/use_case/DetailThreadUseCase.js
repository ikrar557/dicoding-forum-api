const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReplay = require('../../Domains/replays/entities/DetailReplay');

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replayRepository, likesRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replayRepository = replayRepository;
    this._likesRepository = likesRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);

    let comments = await this._commentRepository.getAllCommentsByThreadId(id);

    const replays = await this._replayRepository.fetchAllReplaysByThreadId(id);

    comments = await this._likesRepository.getCommentLikesForEveryComment(comments);

    comments = comments.map((comment) => ({
      ...new DetailComment(comment),
      likeCount: comment.likeCount,
      replies: replays.filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({ ...new DetailReplay(reply) })),
    }));

    return { ...thread, comments };
  }
}

module.exports = DetailThreadUseCase;
