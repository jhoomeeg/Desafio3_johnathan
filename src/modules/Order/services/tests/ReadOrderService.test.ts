import ReadOrderService from "../ReadOrderService";
import Order from "../../models/Order";
import Car from "../../../car/models/car.model";
import Customer from "../../../customer/models/Customer";
import { AppError } from "../../../../shared/errors/AppError";

jest.mock("../../models/Order");
jest.mock("../../../car/models/car.model");
jest.mock("../../../customer/models/Customer");
jest.mock("sequelize", () => {
  const ActualSequelize = jest.requireActual("sequelize");
  return {
    ...ActualSequelize,
    Model: class extends ActualSequelize.Model {
      static belongsTo(_model: unknown, _options: unknown) {}
    },
  };
});

describe("ReadOrderService", () => {
  let readOrderService: ReadOrderService;

  beforeEach(() => {
    jest.clearAllMocks();
    readOrderService = new ReadOrderService();
  });

  it("deve retornar um pedido existente com seus relacionamentos", async () => {
    const mockOrder = {
      id: "1",
      status: "Aberto",
      DataInicial: new Date(),
      DataFinal: new Date(),
      Car: {
        id: "1",
        model: "Modelo X",
      },
      Customer: {
        id: "1",
        nome: "Cliente Exemplo",
      },
    };

    // Mock para Order.findOne
    (Order.findOne as jest.Mock).mockResolvedValue(mockOrder);

    const result = await readOrderService.execute("1");

    expect(result).toEqual(mockOrder);
    expect(Order.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "1" },
        include: [
          {
            model: Car,
            attributes: {
              exclude: [
                "price",
                "registrationDate",
                "status",
                "createdAt",
                "updatedAt",
                "deletedAt",
              ],
            },
          },
          {
            model: Customer,
            attributes: {
              exclude: ["telefone", "dataCadastro", "dataExclusao"],
            },
          },
        ],
      })
    );
  });

  it("deve lançar um erro se o pedido não for encontrado", async () => {
    // Mock para Order.findOne retornar null
    (Order.findOne as jest.Mock).mockResolvedValue(null);

    const executePromise = readOrderService.execute("1");

    await expect(executePromise).rejects.toBeInstanceOf(AppError);
    await expect(executePromise).rejects.toMatchObject({
      message: "Pedido não encontrado",
      statusCode: 404,
    });

    expect(Order.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "1" },
        include: [
          {
            model: Car,
            attributes: {
              exclude: [
                "price",
                "registrationDate",
                "status",
                "createdAt",
                "updatedAt",
                "deletedAt",
              ],
            },
          },
          {
            model: Customer,
            attributes: {
              exclude: ["telefone", "dataCadastro", "dataExclusao"],
            },
          },
        ],
      })
    );
  });
});
