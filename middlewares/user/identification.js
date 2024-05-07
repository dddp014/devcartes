function identification(session, user) {
  return session.passport.user.userId === user.userId;
}

module.exports = identification;
