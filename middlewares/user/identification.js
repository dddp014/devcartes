function Identification(session, user) {
  return session.passport.user.email === user.email;
}

module.exports = Identification;
