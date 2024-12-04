import axios from "axios";
import Order from "../../models/Order";
import UpdateOrderService from "../../services/UpdateOrderService";
import { AppError } from "../../../../shared/errors/AppError";

jest.mock("axios");
jest.mock("../../models/Order");

describe("UpdateOrderService", () => {
  const mockOrder = {
    id: 1,
    status: "Aberto",
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve lançar um erro se o pedido não existir", async () => {
    const mockOrderService = new UpdateOrderService();
    const fakeOrderId = "1";

    // Mockando o retorno de findByPk para simular que o pedido não foi encontrado
    (Order.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(
      mockOrderService.execute({
        id: fakeOrderId,
        DataInicial: new Date("2024-12-03"),
        DataFinal: new Date("2024-12-04"),
        CEP: "50000-000",
        status: "Aprovado",
      })
    ).rejects.toThrow(new AppError("Pedido não encontrado!", 404));
  });

  it("deve lançar um erro se tentar aprovar um pedido que não está com o status 'Aberto'", async () => {
    const mockOrderService = new UpdateOrderService();
    const fakeOrderId = "1";

    // Mockando o retorno de findByPk para simular um pedido com status diferente de 'Aberto'
    (Order.findByPk as jest.Mock).mockResolvedValue({
      id: fakeOrderId,
      status: "Aprovado",
    });

    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + 1)); // Data no futuro

    await expect(
      mockOrderService.execute({
        id: "1",
        DataInicial: new Date("2024-12-03"),
        DataFinal: new Date("2024-12-04"),
        CEP: "01000-000", // Um CEP válido ou inválido
        status: "Aprovado",
      })
    ).rejects.toThrow(
      new AppError("O pedido deve estar em aberto para ser aprovado", 400)
    );
  });

  it("deve lançar um erro se a DataInicial for menor que a data de hoje", async () => {
    // Mock para Order.findByPk retornar um pedido válido
    Order.findByPk = jest.fn().mockResolvedValue(mockOrder);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Data de ontem

    const service = new UpdateOrderService(); // Instanciando a classe

    await expect(
      service.execute({
        id: "1",
        DataInicial: pastDate,
        DataFinal: new Date(),
        CEP: "12345678",
        status: "Aprovado",
      })
    ).rejects.toThrowError(
      new AppError("O pedido deve estar em aberto para ser aprovado", 400)
    );
  });

  it("deve cancelar o pedido se o status for 'Cancelado' e o pedido estiver 'Aberto'", async () => {
    // Mock para Order.findByPk retornar um pedido válido
    Order.findByPk = jest.fn().mockResolvedValue(mockOrder);

    // Mockando o axios para simular uma resposta de CEP válido
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        localidade: "Cidade Teste",
        uf: "SP", // Corrigido para SP
        erro: false,
      },
    });

    mockOrder.update.mockResolvedValue(mockOrder);

    const service = new UpdateOrderService(); // Instanciando a classe
    const result = await service.execute({
      id: "1",
      DataInicial: new Date(),
      DataFinal: new Date(),
      CEP: "12345678",
      status: "Cancelado",
    });

    expect(result).toBe(mockOrder);

    // Comparando as datas mais suavemente (sem preocupação com precisão de milissegundos)
    expect(mockOrder.update).toHaveBeenCalledWith({
      DataInicial: expect.objectContaining({
        getTime: expect.any(Function),
      }),
      DataFinal: expect.objectContaining({
        getTime: expect.any(Function),
      }),
      CEP: "12345678",
      Cidade: "Cidade Teste",
      UF: "SP", // Corrigido para SP
      status: "Cancelado",
      DataCancelamento: expect.objectContaining({
        getTime: expect.any(Function),
      }),
    });
  });
  it("deve lançar um erro se o CEP fornecido for inválido", async () => {
    // Mock para Order.findByPk retornar um pedido válido
    Order.findByPk = jest.fn().mockResolvedValue(mockOrder);

    // Mockando o axios para simular uma resposta de CEP inválido
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        erro: true, // Indica que o CEP é inválido
      },
    });

    const service = new UpdateOrderService(); // Instanciando a classe

    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + 1)); // Data futura

    await expect(
      service.execute({
        id: "1",
        DataInicial: futureDate, // Data válida no futuro
        DataFinal: new Date(today.setDate(today.getDate() + 2)), // Data final válida
        CEP: "00000000", // CEP inválido
        status: "Aberto", // Status válido para o fluxo
      })
    ).rejects.toThrow(new AppError("CEP inválido", 400));
  });
  it("deve lançar um erro se a DataFinal for anterior à DataInicial", async () => {
    // Mock para Order.findByPk retornar um pedido válido
    Order.findByPk = jest.fn().mockResolvedValue(mockOrder);

    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + 2)); // Data futura
    const pastDate = new Date(today.setDate(today.getDate() - 1)); // Data passada

    const service = new UpdateOrderService(); // Instanciando a classe

    await expect(
      service.execute({
        id: "1",
        DataInicial: futureDate, // Data inicial futura
        DataFinal: pastDate, // Data final anterior à DataInicial
        CEP: "12345678", // CEP válido
        status: "Aberto", // Status válido
      })
    ).rejects.toThrow(
      new AppError("A data final não pode ser anterior à data inicial", 400)
    );
  });
});
