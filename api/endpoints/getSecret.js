const Secret = require("../models/Secret");
const { decryptSecret } = require("../utils/crypto");
const { validateQueryParamString } = require("../utils/secretValidator");

const getSecret = async (req, res) => {
  const hash = req.params.hash;
  const { errorMessage, isValid } = validateQueryParamString(hash);
  if (!isValid) {
    return res.status(400).json(errorMessage);
  }

  try {
    Secret.findOne({ urlHash: hash }).then(async secretFound => {
      if (secretFound) {
        if (secretFound.remainingViews <= 1) {
          secretFound.remove();
          return res.status(200).json({
            hash: secretFound.urlHash,
            secretText: decryptSecret(secretFound.secretHash),
            createdAt: secretFound.createdAt,
            expiresAt: secretFound.expiresAt,
            remainingViews: 0
          })
        } else {
          secretFound.remainingViews = secretFound.remainingViews - 1;
          const secretUpdated = await secretFound.save();
          return res.status(200).json({
            hash: secretUpdated.urlHash,
            secretText: decryptSecret(secretUpdated.secretHash),
            createdAt: secretUpdated.createdAt,
            expiresAt: secretUpdated.expiresAt,
            remainingViews: secretUpdated.remainingViews
          });
        }
      } else {
        return res.status(410).json("Secret does not exist!");
      }
    });
  } catch (error) {
    const errorMessage = `Error happened on getting secret: ${error}`;
    console.error(errorMessage);
    return res.status(404).json(errorMessage);
  }
};

module.exports = getSecret;
