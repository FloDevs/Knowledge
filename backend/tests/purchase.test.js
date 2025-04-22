const Purchase = require("../models/Purchase");
const User = require("../models/User");
const Cursus = require("../models/Cursus");
const Lesson = require("../models/Lesson");
const Theme = require("../models/Theme");

describe("Modèle Purchase", () => {
  it("devrait créer un achat pour un cursus", async () => {
    const theme = await Theme.create({ name: "Développement" });
    const user = await User.create({
      name: "Buyer",
      email: "buy@example.com",
      password: "123456",
    });
    const cursus = await Cursus.create({
      title: "Cursus test",
      price: 99,
      theme: theme._id,
    });

    const purchase = await Purchase.create({
      user: user._id,
      cursus: cursus._id,
    });

    expect(purchase).toHaveProperty("user");
    expect(purchase).toHaveProperty("cursus");
    expect(purchase.lesson).toBeUndefined();
  });

  it("devrait créer un achat pour une leçon", async () => {
    const theme = await Theme.create({ name: "Design" });
    const user = await User.create({
      name: "Buyer2",
      email: "buy2@example.com",
      password: "abcdef",
    });
    const cursus = await Cursus.create({
      title: "Cursus pour leçon",
      price: 59,
      theme: theme._id,
    });

    const lesson = await Lesson.create({
      title: "Leçon test",
      price: 29,
      cursus: cursus._id,
    });

    const purchase = await Purchase.create({
      user: user._id,
      lesson: lesson._id,
    });

    expect(purchase).toHaveProperty("user");
    expect(purchase).toHaveProperty("lesson");
    expect(purchase.cursus).toBeUndefined();
  });
});
