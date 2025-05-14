/* istanbul ignore file */
const { createContainer } = require('instances-container');

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

const UserRepository = require('../Domains/users/UserRepository');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');

const PasswordHash = require('../Applications/security/PasswordHash');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');

const ThreadRepository = require('../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');

const CommentRepository = require('../Domains/comments/CommentsRepository');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');

const ReplayRepository = require('../Domains/replays/ReplayRepository');
const ReplayRepositoryPostgres = require('./repository/ReplayRepositoryPostgres');

const LikesRepository = require('../Domains/likes/LikesRepository');
const LikesRepositoryPostgres = require('./repository/LikesRepositoryPostgres');

const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');

const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');

const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');

const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const DetailThreadUseCase = require('../Applications/use_case/DetailThreadUseCase');

const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');

const AddReplayUseCase = require('../Applications/use_case/AddReplayUseCase');
const DeleteReplayUseCase = require('../Applications/use_case/DeleteReplayUseCase');

const LikeOrUnlikeCommentUseCase = require('../Applications/use_case/LikeOrUnlikeCommentUseCase');

const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ReplayRepository.name,
    Class: ReplayRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: LikesRepository.name,
    Class: LikesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DetailThreadUseCase.name,
    Class: DetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replayRepository',
          internal: ReplayRepository.name,
        },
        {
          name: 'likesRepository',
          internal: LikesRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplayUseCase.name,
    Class: AddReplayUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'replayRepository',
          internal: ReplayRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplayUseCase.name,
    Class: DeleteReplayUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'replayRepository',
          internal: ReplayRepository.name,
        },
      ],
    },
  },
  {
    key: LikeOrUnlikeCommentUseCase.name,
    Class: LikeOrUnlikeCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name,
        },
        {
          name: 'likesRepository',
          internal: LikesRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
