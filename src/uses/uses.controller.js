const uses = require("../data/uses-data");

function list(req, res) {
  const { urlId } = req.params;
  if (urlId) {
    res.json({ data: uses.filter((use) => use.urlId == urlId) });
  }
  res.json({ data: uses });
}

function useExists(req, res, next) {
  const { useId } = req.params;
  const foundUse = uses.find((use) => use.id === Number(useId));
  if (foundUse) {
    res.locals.use = foundUse;
    return next();
  }
  next({
    status: 404,
    message: `Use id not found: ${useId}`,
  });
}

function read(req, res, next) {
  res.json({ data: res.locals.use });
}

function destroy(req, res) {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  const deletedUses = uses.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [useExists, read],
  delete: [useExists, destroy],
};
