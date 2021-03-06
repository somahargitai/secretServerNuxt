const Secret = require("../models/Secret");
const { decryptSecret } = require("../utils/crypto");
const { validateQueryParamString } = require("../utils/secretValidator");

const getSecret = async (req, res) => {
  res.type("application/json");
  const hash = req.params.hash;
  const { errorMessage, isValid } = validateQueryParamString(hash);
  if (!isValid) {
    res.status(400);
    return res.json({
      errorMessage
    });
  }

  try {
    const secretFound = await Secret.findOneAndUpdate(
      { urlHash: hash },
      {
        $inc: {
          remainingViews: -1
        }
      },
      { new: true }
    );

    if (secretFound.remainingViews <= 0) {
      try {
        const deleteResponse = await Secret.deleteOne({ urlHash: hash });
        if (deleteResponse.deletedCount === 1) {
          res.status(202);
          return res.json({
            hash: secretFound.urlHash,
            secretText: decryptSecret(secretFound.secretHash),
            createdAt: secretFound.createdAt,
            expiresAt: secretFound.expiresAt,
            remainingViews: 0
          });
        } else {
          throw new Error("Could not been removed");
        }
      } catch (error) {
        const errorMessage =
          "Database error! Reached view limit, but could not been deleted!";
        console.error(errorMessage);
        console.error(error);
        res.status(403);
        return res.json({
          errorMessage
        });
      }
    } else {
      res.status(200);
      return res.json({
        hash: secretFound.urlHash,
        secretText: decryptSecret(secretFound.secretHash),
        createdAt: secretFound.createdAt,
        expiresAt: secretFound.expiresAt ? secretFound.expiresAt : "",
        remainingViews: secretFound.remainingViews
      });
    }
  } catch (error) {
    const errorMessage = `Error happened on getting secret: ${error}`;
    console.error(errorMessage);
    res.status(503);
    return res.json(errorMessage);
  }
};

module.exports = getSecret;
