const User = require("../models/User");
const bcrypt = require("bcrypt");

describe("Authentification utilisateur", () => {
  it("doit réussir la connexion avec le bon mot de passe", async () => {
    const password = "securepass";

    await User.create({
      name: "AuthUser",
      email: "auth@example.com",
      password,
      isVerified: true,
    });

    const user = await User.findOne({ email: "auth@example.com" });
    const isValid = await bcrypt.compare(password, user.password);

    expect(isValid).toBe(true);
  });

  it("doit échouer avec un mot de passe incorrect", async () => {
    const password = "securepass";

    await User.create({
      name: "AuthUser2",
      email: "auth2@example.com",
      password,
      isVerified: true,
    });

    const user = await User.findOne({ email: "auth2@example.com" });
    const isValid = await bcrypt.compare("wrongpass", user.password);

    expect(isValid).toBe(false);
  });
});
