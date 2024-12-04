import { Sequelize } from "sequelize";
import Car from "../../models/car.model";

describe("Car Model", () => {
  it("deve lançar um erro se o ano for mais antigo do que o permitido", async () => {
    const currentYear = new Date().getFullYear();
    const invalidYear = currentYear - 12;

    await expect(
      Car.create({
        plate: "ABC1234",
        brand: "Toyota",
        model: "Corolla",
        km: 10000,
        year: invalidYear,
        items: ["Air Conditioning"],
        price: 50000,
        registrationDate: new Date(),
        status: "active",
      })
    ).rejects.toThrow("O carro não pode ter mais de 11 anos.");
  });

  it("deve lançar um erro se o array de itens tiver duplicatas", async () => {
    await expect(
      Car.create({
        plate: "DEF5678",
        brand: "Honda",
        model: "Civic",
        km: 5000,
        year: 2020,
        items: ["GPS", "GPS"], // Duplicado
        price: 60000,
        registrationDate: new Date(),
        status: "active",
      })
    ).rejects.toThrow("Items cannot contain duplicates");
  });

  it("deve lançar um erro se a placa não for única", async () => {
    // Primeiro carro criado com sucesso
    await Car.create({
      plate: "GHI9012",
      brand: "Ford",
      model: "Focus",
      km: 20000,
      year: 2022,
      items: ["Sunroof"],
      price: 70000,
      registrationDate: new Date(),
      status: "active",
    });

    // Tentativa de criar outro carro com a mesma placa
    await expect(
      Car.create({
        plate: "GHI9012", // Placa duplicada
        brand: "Chevrolet",
        model: "Onix",
        km: 15000,
        year: 2023,
        items: ["Bluetooth"],
        price: 80000,
        registrationDate: new Date(),
        status: "active",
      })
    ).rejects.toThrow("Validation error");
  });
});
