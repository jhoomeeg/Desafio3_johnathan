import deleteCar from "../deleteCarService"; // Caminho do serviço deleteCar
import { AppError } from "../../../../shared/errors/AppError";
import Car from "../../models/car.model";

// Mockando o modelo Car
jest.mock("../../models/car.model", () => ({
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));

describe("deleteCar", () => {
  it("should throw an error if the car is not found", async () => {
    // Mockando o retorno de findByPk para simular que o carro não foi encontrado
    (Car.findByPk as jest.Mock).mockResolvedValue(null);

    // Verificando se o erro é lançado quando o carro não é encontrado
    await expect(deleteCar("non-existent-id")).rejects.toThrow(
      new AppError("Car not found")
    );
  });

  it("should delete the car and return a success message if the car is found", async () => {
    const mockCar = {
      id: "123",
      destroy: jest.fn(), // Mockando o método destroy
    };

    // Mockando o retorno de findByPk para simular que o carro foi encontrado
    (Car.findByPk as jest.Mock).mockResolvedValue(mockCar);

    // Chama a função deleteCar
    const result = await deleteCar("123");

    // Verificando se o carro foi deletado e se a mensagem de sucesso foi retornada
    expect(mockCar.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: "Car deleted successfully" });
  });
});
