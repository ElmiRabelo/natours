module.exports = fn => {
  // when express hit the route it'll return this function that returns a promisse
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
