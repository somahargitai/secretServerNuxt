const Secret = require("../../models/Secret");
const createNewSecret = require("../../endpoints/createNewSecret");
const { encryptSecret } = require("../../utils/crypto");

jest.mock("../../models/Secret");
jest.mock("../../utils/crypto");

describe("createNewSecret", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    encryptSecret.mockImplementation(
      hash => "01dfae6e5d4d90d9892622325959afbe"
    );
  });

  const secretDb = {
    urlHash: "01dfae6e5d4d90d9892622325959afbe",
    secretHash: "123456789",
    createdAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
    expiresAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
    remainingViews: 10
  };

  const req = {
    body: {
      secret: "this is a secret",
      expireAfterViews: "3",
      expireAfter: "3"
    }
  };

  const res = {
    status: jest.fn(),
    type: jest.fn(),
    json: jest.fn()
  };

  test("successfully created a new secret", async () => {
    const secretResponse = {
      hash: "01dfae6e5d4d90d9892622325959afbe",
      secretText: "this is a secret",
      createdAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
      expiresAt: "Mon Jun 24 2002 18:30:00 GMT+0200",
      remainingViews: 10
    };

    Secret.create = jest.fn(() => Promise.resolve(secretDb));
    await createNewSecret(req, res);

    expect(res.type).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.type).toHaveBeenCalledWith("application/json");
    expect(res.json).toHaveBeenCalledWith(secretResponse);

    expect(Secret.create).toHaveBeenCalledTimes(1);
  });

  test("service unavailable", async () => {
    Secret.create = jest.fn(() =>
      Promise.reject(new Error("DB not available"))
    );
    await createNewSecret(req, res);

    expect(res.type).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.type).toHaveBeenCalledWith("application/json");
    expect(res.json).toHaveBeenCalledWith({
      errorMessage: "Error happened on creating Error: DB not available"
    });

    expect(Secret.create).toHaveBeenCalledTimes(1);
  });
  test("service unavailable", async () => {
    Secret.create = jest.fn(() => Promise.resolve(secretDb));
    await createNewSecret(
      {
        body: {
          secret: "this is a secret",
          expireAfterViews: "bob",
          expireAfter: "bob"
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
      errorMessage: "Error! A view limit, greater than 0 should be provided"
    });

    expect(Secret.create).toHaveBeenCalledTimes(0);
  });
});
