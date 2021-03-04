const Secret = require("../models/Secret");
const { validateSecret } = require("../utils/secretValidator");
const { encryptSecret } = require("../utils/crypto");
const { v4: uuidv4 } = require("uuid");

const createNewSecret = async (req, res) => {
  const { errorMessage, isValid } = validateSecret(req.body);
  if (!isValid) {
    return res.status(400).json(errorMessage);
  }

  try {
    const hash = uuidv4();
    const currentDate = Date.now();
    const expireInMillisecss = req.body.expireAfter * 60000;
    const expirationDate = new Date(currentDate + expireInMillisecss);

    const newSecret = new Secret({
      urlHash: hash,
      secretHash: encryptSecret(req.body.secret),
      createdAt: currentDate,
      expiresAt: expirationDate,
      remainingViews: req.body.expireAfterViews
    });
    newSecret.expiresAt.expires = expireInMillisecss;

    newSecret.save().then(() => {
      res.type("application/json");
      res.status(201);
      return res.json({
        hash: newSecret.urlHash,
        secretText: req.body.secret,
        createdAt: newSecret.createdAt,
        expiresAt: newSecret.expiresAt,
        remainingViews: newSecret.remainingViews
      });
    });
  } catch (error) {
    const errorDesc = `Error happened on creating ${error}`;
    console.error(errorDesc);
    res.status(503);
    return res.json(errorDesc);
  }
};

module.exports = createNewSecret;
