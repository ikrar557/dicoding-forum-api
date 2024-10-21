exports.up = (pgm) => {
  pgm.createTable('replays', {
    id: {
      type: 'VARCHAR',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'VARCHAR',
      default: pgm.func('current_timestamp'),
    },
    comment_id: {
      type: 'VARCHAR',
    },
    user_id: {
      type: 'VARCHAR',
    },
    is_deleted: {
      type: 'BOOLEAN',
      default: false,
    },
  });

  pgm.addConstraint('replays', 'fk_replays.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('replays', 'fk_replays.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('replays', 'fk_replays.comment_id_comments.id');
  pgm.dropConstraint('replays', 'fk_replays.user_id_users.id');
  pgm.dropTable('replays');
};
