import getAllCars from "../listCarService"; // Caminho para o serviço getAllCars
import Car from "../../models/car.model";

// Mockando o modelo Car
jest.mock("../../models/car.model", () => ({
  findAll: jest.fn(),
}));

describe("getAllCars", () => {
  // Limpar os mocks antes de cada teste
  beforeEach(() => {
    (Car.findAll as jest.Mock).mockClear();
  });
  it("should return a list of cars when cars are found", async () => {
    // Mockando o retorno de findAll para simular a existência de carros
    const mockCars = [
      {
        id: "1",
        plate: "ABC1234",
        brand: "Brand A",
        model: "Model A",
        km: 10000,
        year: 2020,
        items: ["Airbags"],
        price: 20000,
        status: "active",
      },
      {
        id: "2",
        plate: "XYZ5678",
        brand: "Brand B",
        model: "Model B",
        km: 15000,
        year: 2021,
        items: ["ABS"],
        price: 25000,
        status: "inactive",
      },
    ];

    (Car.findAll as jest.Mock).mockResolvedValue(mockCars);

    // Chamando a função getAllCars
    const result = await getAllCars();

    // Verificando se a função retornou os carros corretamente
    expect(result).toEqual(mockCars);
    expect(Car.findAll).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list when no cars are found", async () => {
    // Mockando o retorno de findAll para simular que não há carros
    (Car.findAll as jest.Mock).mockResolvedValue([]);

    // Chamando a função getAllCars
    const result = await getAllCars();

    // Verificando se a função retornou uma lista vazia
    expect(result).toEqual([]);
    expect(Car.findAll).toHaveBeenCalledTimes(1);
  });
});
