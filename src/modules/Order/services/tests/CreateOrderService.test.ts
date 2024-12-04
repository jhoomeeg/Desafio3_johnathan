import CreaterOrderService from "../CreaterOrderService";
import Customer from "../../../customer/models/Customer";
import { AppError } from "../../../../shared/errors/AppError";
import Order from "../../models/Order";
import Car from "../../../car/models/car.model";
import axios from "axios";

jest.mock("axios");
jest.mock("../../../car/models/car.model");
jest.mock("../../models/Order");
jest.mock("../../../customer/models/Customer"); // Mocka a entidade Customer
jest.mock("sequelize", () => {
  const ActualSequelize = jest.requireActual("sequelize");
  return {
    ...ActualSequelize,
    Model: class extends ActualSequelize.Model {
      static belongsTo(_model: unknown, _options: unknown) {}
    },
  };
});

describe("CreaterOrderService", () => {
  let createrOrderService: CreaterOrderService;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks entre os testes
    createrOrderService = new CreaterOrderService();
  });

  it("deve lançar um erro se o cliente não for encontrado", async () => {
    // Configura o mock para retornar null
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    // Captura a promessa retornada pelo método execute
    const executePromise = createrOrderService.execute({
      email: "cliente_inexistente@example.com",
      plate: "ABC-1234", // Valores fictícios
      CEP: "12345-678", // Valores fictícios
    });

    // Testa se lança um AppError
    await expect(executePromise).rejects.toBeInstanceOf(AppError);

    // Testa a mensagem e o status do erro
    await expect(executePromise).rejects.toMatchObject({
      message: "Cliente não encontrado",
      statusCode: 404,
    });

    // Verifica se Customer.findOne foi chamado com o email correto
    expect(Customer.findOne).toHaveBeenCalledTimes(1);
    expect(Customer.findOne).toHaveBeenCalledWith({
      where: { email: "cliente_inexistente@example.com" },
    });
  });
  it("deve lançar um erro se o cliente já possui pedido em aberto", async () => {
    // Mock para retornar um cliente válido
    (Customer.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "cliente_existente@example.com",
    });

    // Mock para retornar um carro válido
    (Car.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      plate: "CAR-1234",
    });

    // Mock para simular pedido em aberto
    (Order.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      cliente: 1,
      Status: "Aberto",
    });

    // Verificação de erro
    await expect(
      createrOrderService.execute({
        email: "cliente_existente@example.com",
        plate: "CAR-1234",
        CEP: "12345-678",
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createrOrderService.execute({
        email: "cliente_existente@example.com",
        plate: "CAR-1234",
        CEP: "12345-678",
      })
    ).rejects.toMatchObject({
      message: "Cliente já possui pedido em aberto",
      statusCode: 400,
    });

    expect(Customer.findOne).toHaveBeenCalledTimes(2); // Espera 1 chamada
    expect(Car.findOne).toHaveBeenCalledTimes(2); // Espera 1 chamada
    expect(Order.findOne).toHaveBeenCalledTimes(2); // Espera 1 chamada

    expect(Customer.findOne).toHaveBeenCalledWith({
      where: { email: "cliente_existente@example.com" },
    });
    expect(Car.findOne).toHaveBeenCalledWith({
      where: { plate: "CAR-1234" },
    });
    expect(Order.findOne).toHaveBeenCalledWith({
      where: { cliente: 1, Status: "Aberto" },
    });
  });

  it("deve criar um pedido com sucesso", async () => {
    // Mock para retornar um cliente válido
    (Customer.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: "cliente_validado@example.com",
    });

    // Mock para retornar um carro válido
    (Car.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      plate: "CAR-1234",
      price: 100,
    });

    // Mock para retornar um CEP válido
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        localidade: "Cidade Exemplo",
        uf: "AL",
      },
    });

    // Mock para garantir que a consulta ao pedido não retorna um pedido em aberto
    (Order.findOne as jest.Mock).mockResolvedValue(null);

    // Mock para criar o pedido
    (Order.create as jest.Mock).mockResolvedValue({
      cliente: 1,
      CarroPedido: 1,
      CEP: "12345-678",
      Cidade: "Cidade Exemplo",
      UF: "AL",
      ValorTotal: 100,
      status: "Aberto",
      dataFinal: null,
      dataCancelamento: null,
    });

    // Executa a função de criação de pedido
    const result = await createrOrderService.execute({
      email: "cliente_validado@example.com",
      plate: "CAR-1234",
      CEP: "12345-678",
    });

    // Verifica se o pedido foi criado corretamente
    expect(result).toHaveProperty("status", "Aberto");
    expect(result).toHaveProperty("ValorTotal", 100);
    expect(Order.create).toHaveBeenCalledTimes(1);
  });
});
