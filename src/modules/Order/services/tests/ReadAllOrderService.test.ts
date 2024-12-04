import ReadAllOrderService from "../ReadAllOrderService";
import Order from "../../models/Order";
import Customer from "../../../customer/models/Customer";
import { AppError } from "../../../../shared/errors/AppError";
import { Op } from "sequelize";

jest.mock("../../models/Order");
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

describe("ReadAllOrderService", () => {
  let readAllOrderService: typeof ReadAllOrderService;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks entre os testes
    readAllOrderService = ReadAllOrderService;
  });

  it("deve retornar pedidos com base no status", async () => {
    const mockOrders = [
      {
        id: "1",
        status: "Aberto",
        DataInicial: new Date(),
        DataFinal: new Date(),
      },
      {
        id: "2",
        status: "Fechado",
        DataInicial: new Date(),
        DataFinal: new Date(),
      },
    ];

    // Mock para Order.findAndCountAll retornar pedidos filtrados por status
    (Order.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 1,
      rows: [mockOrders[0]],
    });

    const result = await readAllOrderService.getOrders({
      status: "Aberto",
      page: 1,
      pageSize: 10,
    });

    expect(result.totalOrders).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.orders).toEqual([mockOrders[0]]);

    expect(Order.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "Aberto" },
        limit: 10,
        offset: 0,
      })
    );
  });

  it("deve retornar vazio se nenhum pedido corresponder aos critérios de busca", async () => {
    // Mock para Order.findAndCountAll retornar nenhum pedido
    (Order.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 0,
      rows: [],
    });

    const result = await readAllOrderService.getOrders({
      status: "Inexistente",
      page: 1,
      pageSize: 10,
    });

    expect(result.totalOrders).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.orders).toEqual([]);

    expect(Order.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "Inexistente" },
        limit: 10,
        offset: 0,
      })
    );
  });
  it("deve paginar os resultados corretamente", async () => {
    const mockOrders = [
      {
        id: "1",
        status: "Aberto",
        DataInicial: new Date(),
        DataFinal: new Date(),
      },
      {
        id: "2",
        status: "Fechado",
        DataInicial: new Date(),
        DataFinal: new Date(),
      },
      {
        id: "3",
        status: "Aberto",
        DataInicial: new Date(),
        DataFinal: new Date(),
      },
    ];

    // Mock para Order.findAndCountAll com paginação
    (Order.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 3, // Total de 3 pedidos
      rows: [mockOrders[0], mockOrders[2]], // Simula os 2 primeiros pedidos
    });

    const result = await readAllOrderService.getOrders({
      page: 1,
      pageSize: 2, // Página 1, 2 itens por página
    });

    expect(result.totalOrders).toBe(3); // 3 pedidos no total
    expect(result.totalPages).toBe(2); // 2 páginas
    expect(result.orders).toEqual([mockOrders[0], mockOrders[2]]); // Primeiros 2 pedidos

    expect(Order.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 2,
        offset: 0,
      })
    );
  });
  it("deve retornar pedidos com base no CPF", async () => {
    const mockCustomer = { id: "1", nome: "Cliente Teste", cpf: "12345678900" };
    const mockOrders = [
      {
        id: "1",
        status: "Aberto",
        DataInicial: new Date(),
        DataFinal: new Date(),
        Cliente: mockCustomer.id,
      },
    ];

    // Mock para Customer.findOne retornar o cliente baseado no CPF
    (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

    // Mock para Order.findAndCountAll retornar pedidos relacionados ao cliente
    (Order.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 1,
      rows: mockOrders,
    });

    const result = await readAllOrderService.getOrders({
      CPF: "12345678900",
      page: 1,
      pageSize: 10,
    });

    expect(result.totalOrders).toBe(1); // Deve retornar 1 pedido
    expect(result.totalPages).toBe(1); // Apenas 1 página necessária
    expect(result.orders).toEqual(mockOrders); // Pedido filtrado pelo CPF

    expect(Customer.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { CPF: "12345678900" } })
    );

    expect(Order.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { Cliente: mockCustomer.id },
        limit: 10,
        offset: 0,
      })
    );
  });
  it("deve retornar pedidos com base no intervalo de datas", async () => {
    const mockOrders = [
      {
        id: "1",
        status: "Aberto",
        DataInicial: new Date("2024-01-01"),
        DataFinal: new Date("2024-01-10"),
      },
      {
        id: "2",
        status: "Aberto",
        DataInicial: new Date("2024-01-05"),
        DataFinal: new Date("2024-01-15"),
      },
    ];

    // Mock para Order.findAndCountAll com pedidos no intervalo de datas
    (Order.findAndCountAll as jest.Mock).mockResolvedValue({
      count: 2,
      rows: mockOrders,
    });

    const result = await readAllOrderService.getOrders({
      DataInicial: "2024-01-01",
      DataFinal: "2024-01-15",
      page: 1,
      pageSize: 10,
    });

    expect(result.totalOrders).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.orders).toEqual(mockOrders);
  });
});
