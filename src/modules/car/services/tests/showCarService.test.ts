import { AppError } from "../../../../shared/errors/AppError";
import Car from "../../models/car.model";
import getCarById from "../showCarService";

// Mockando o modelo Car
jest.mock("../../models/car.model", () => ({
  findByPk: jest.fn(),
}));

describe("getCarById", () => {
  const mockCarData = {
    id: "1",
    plate: "ABC1234",
    brand: "Brand A",
    model: "Model A",
    km: 10000,
    year: 2020,
    items: ["Airbags"],
    price: 20000,
    status: "active",
  };

  // Limpar mocks antes de cada teste para garantir que o estado do mock não seja compartilhado
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a car when the car exists", async () => {
    // Configura o mock para retornar o carro encontrado
    (Car.findByPk as jest.Mock).mockResolvedValue(mockCarData);

    const result = await getCarById("1");

    expect(result).toEqual(mockCarData); // Verifica se o carro retornado é o esperado
    expect(Car.findByPk).toHaveBeenCalledWith("1"); // Verifica se o método foi chamado com o ID correto
    expect(Car.findByPk).toHaveBeenCalledTimes(1); // Verifica se o método foi chamado apenas uma vez
  });

  it("should throw an error if the car does not exist", async () => {
    // Configura o mock para simular que o carro não foi encontrado
    (Car.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(getCarById("non-existing-id")).rejects.toThrowError(
      new AppError("Car not found")
    );
    expect(Car.findByPk).toHaveBeenCalledWith("non-existing-id"); // Verifica se o método foi chamado com o ID correto
    expect(Car.findByPk).toHaveBeenCalledTimes(1); // Verifica se o método foi chamado apenas uma vez
  });
});
