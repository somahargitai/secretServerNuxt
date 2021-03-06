const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

const Secret = require("../models/Secret");
const { validateSecret } = require("../utils/secretValidator");
const { encryptSecret } = require("../utils/crypto");

const createNewSecret = async (req, res) => {
  res.type("application/json");
  const { errorMessage, isValid } = validateSecret(req.body);
  if (!isValid) {
    res.status(400);
    return res.json({ errorMessage });
  }

  try {
    const hash = uuidv4();
    const currentDate = Date.now();

    const newSecretObject = {
      urlHash: hash,
      secretHash: encryptSecret(req.body.secret),
      createdAt: currentDate,
      remainingViews: req.body.expireAfterViews
    };

    if (req.body.expireAfter != 0) {
      newSecretObject.expiresAt = moment().add(req.body.expireAfter, "minutes");
    }

    const newSecret = await Secret.create(newSecretObject);
    res.status(201);
    return res.json({
      hash: newSecret.urlHash,
      secretText: req.body.secret,
      createdAt: newSecret.createdAt,
      expiresAt: newSecret.expiresAt ? newSecret.expiresAt : "",
      remainingViews: newSecret.remainingViews
    });
  } catch (error) {
    const errorDesc = `Error happened on creating ${error}`;
    console.error(errorDesc);
    res.status(503);
    return res.json({ errorMessage: errorDesc });
  }
};

module.exports = createNewSecret;
