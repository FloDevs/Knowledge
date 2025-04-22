const User = require("../models/User");

describe("User Model", () => {
  it("devrait enregistrer un utilisateur", async () => {
    const user = new User({
      name: "Test",
      email: "test@example.com",
      password: "123456",
    });
    await user.save();

    const found = await User.findOne({ email: "test@example.com" });
    expect(found).not.toBeNull();
    expect(found.name).toBe("Test");
  });

  it("ne doit pas autoriser deux utilisateurs avec le même email", async () => {
    const user1 = new User({
      name: "User1",
      email: "duplicate@example.com",
      password: "123456",
    });
    await user1.save();

    try {
      const user2 = new User({
        name: "User2",
        email: "duplicate@example.com",
        password: "abcdef",
      });
      await user2.save();
      throw new Error("La validation aurait dû échouer");
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
