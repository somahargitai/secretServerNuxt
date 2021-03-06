const Secret = require("../../models/Secret");
const getSecret = require("../../endpoints/getSecret");
const { decryptSecret } = require("../../utils/crypto");

jest.mock("../../models/Secret");
jest.mock("../../utils/crypto");

describe("getSecret", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    decryptSecret.mockImplementation(hash => "this is a secret");
  });

  const deleteOneResponse = {
    n: 1,
    ok: 1,
    deletedCount: 1
  };

  const secretDb = {
    urlHash: "01dfae6e5d4d90d9892622325959afbe",
    secretHash: "123456789",
    createdAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
    expiresAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
    remainingViews: 10
  };

  const secretResponse = {
    hash: "01dfae6e5d4d90d9892622325959afbe",
    secretText: "this is a secret",
    createdAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
    expiresAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
    remainingViews: 10
  };

  const req = {
    params: {
      hash: secretResponse.hash
    }
  };

  const res = {
    status: jest.fn(),
    type: jest.fn(),
    json: jest.fn()
  };

  test("successfully received Secret with remaining views", async () => {
    Secret.findOneAndUpdate = jest.fn(() => Promise.resolve(secretDb));
    Secret.deleteOne = jest.fn(() => Promise.resolve(deleteOneResponse));

    await getSecret(req, res);

    expect(res.type).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.type).toHaveBeenCalledWith("application/json");
    expect(res.json).toHaveBeenCalledWith(secretResponse);

    expect(Secret.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(Secret.deleteOne).toHaveBeenCalledTimes(0);
  });

  test("successfully received last view", async () => {
    const secretDbLast = {
      urlHash: "01dfae6e5d4d90d9892622325959afbe",
      secretHash: "123456789",
      createdAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
      expiresAt: "Mon Jun 24 2002 18:31:00 GMT+0200",
      remainingViews: 0
    };

    const secretResponseLast = {
      hash: "01dfae6e5d4d90d9892622325959afbe",
      secretText: "this is a secret",
      createdAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
      expiresAt: "Mon Jun 24 2002 18:31:00 GMT+0200",
      remainingViews: 0
    };

    Secret.findOneAndUpdate = jest.fn(() => Promise.resolve(secretDbLast));
    Secret.deleteOne = jest.fn(() => Promise.resolve(deleteOneResponse));

    await getSecret(req, res);

    expect(res.type).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.type).toHaveBeenCalledWith("application/json");
    expect(res.json).toHaveBeenCalledWith(secretResponseLast);

    expect(Secret.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(Secret.deleteOne).toHaveBeenCalledTimes(1);
  });

  test("error - invalid parameter set", async () => {
    Secret.findOneAndUpdate = jest.fn(() => Promise.resolve(secretDb));
    Secret.deleteOne = jest.fn(() => Promise.resolve(deleteOneResponse));

    await getSecret(
      {
        params: {
          hash: undefined
        }
      },
      res
    );

    expect(res.type).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.type).toHaveBeenCalledWith("application/json");
    expect(res.json).toHaveBeenCalledWith({
      errorMessage:
        "Error! A non-zero long query parameter string must be provided"
    });

    expect(Secret.findOneAndUpdate).toHaveBeenCalledTimes(0);
    expect(Secret.deleteOne).toHaveBeenCalledTimes(0);
  });

  test("error - secret found, but unable to delete", async () => {
    const secretDbLast = {
      urlHash: "01dfae6e5d4d90d9892622325959afbe",
      secretHash: "123456789",
      createdAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
      expiresAt: "Mon Jun 24 2002 18:31:00 GMT+0200",
      remainingViews: 0
    };

    Secret.findOneAndUpdate = jest.fn(() => Promise.resolve(secretDbLast));
    Secret.deleteOne = jest.fn(() =>
      Promise.reject(
        new Error(
          "Database error! Reached view limit, but could not been deleted!"
        )
      )
    );

    await getSecret(req, res);

    expect(res.type).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.type).toHaveBeenCalledWith("application/json");
    expect(res.json).toHaveBeenCalledWith({
      errorMessage:
        "Database error! Reached view limit, but could not been deleted!"
    });

    expect(Secret.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(Secret.deleteOne).toHaveBeenCalledTimes(1);
  });

  test("error - database service is not available", async () => {
    Secret.findOneAndUpdate = jest.fn(() =>
      Promise.reject(new Error("DB not available"))
    );
    Secret.deleteOne = jest.fn(() => Promise.resolve(deleteOneResponse));

    await getSecret(req, res);

    expect(res.type).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.type).toHaveBeenCalledWith("application/json");
    expect(res.json).toHaveBeenCalledWith({
      errorMessage: "Error happened on getting secret: Error: DB not available"
    });

    expect(Secret.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(Secret.deleteOne).toHaveBeenCalledTimes(0);
  });
});
