const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function list(req, res) {
  res.json({ data: urls });
}

function bodyHasHref(req, res, next) {
  const { data: { href } = {} } = req.body;
  if (href) {
    return next();
  }
  next({
    status: 400,
    message: "Must include a href",
  });
}

function create(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    href: href,
    id: urls.length + 1,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}

function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  if (foundUrl) {
    res.locals.url = foundUrl;
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`,
  });
}

function read(req, res, next) {
  uses.push({
    id: uses.length + 1,
    time: Date.now(),
    urlId: res.locals.url.id,
  });
  res.json({ data: res.locals.url });
}

function update(req, res) {
  const url = res.locals.url;
  const { data: { href } = {} } = req.body;

  url.href = href;

  res.json({ data: url });
}

module.exports = {
  list,
  create: [bodyHasHref, create],
  read: [urlExists, read],
  update: [urlExists, bodyHasHref, update],
  urlExists,
};
