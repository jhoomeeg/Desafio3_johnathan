import DeleteOrderService from "../DeleteOrderService";
import Order from "../../models/Order";
import { AppError } from "../../../../shared/errors/AppError";

jest.mock("../../models/Order");

describe("DeleteOrderService", () => {
  let deleteOrderService: DeleteOrderService;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks entre os testes
    deleteOrderService = new DeleteOrderService();
  });

  it("deve lançar um erro se o pedido não for encontrado", async () => {
    // Mock para Order.findOne retornar null, simulando pedido não encontrado
    (Order.findOne as jest.Mock).mockResolvedValue(null);

    // Chama a função execute e verifica se o erro é lançado
    const executePromise = deleteOrderService.execute("1");
    await expect(executePromise).rejects.toBeInstanceOf(AppError);
    await expect(executePromise).rejects.toMatchObject({
      message: "Pedido não encontrado!",
      statusCode: 404,
    });

    // Verifica se Order.findOne foi chamado corretamente
    expect(Order.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });

  it("deve lançar um erro se o pedido não estiver com status 'Aberto'", async () => {
    // Mock para Order.findOne retornar um pedido com status diferente de 'Aberto'
    (Order.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      status: "Fechado",
      save: jest.fn(),
      destroy: jest.fn(),
    });

    // Chama a função execute e verifica se o erro é lançado
    const executePromise = deleteOrderService.execute("1");
    await expect(executePromise).rejects.toBeInstanceOf(AppError);
    await expect(executePromise).rejects.toMatchObject({
      message: 'Apenas pedidos com status "Aberto" podem ser cancelados',
      statusCode: 403,
    });

    // Verifica se Order.findOne foi chamado corretamente
    expect(Order.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });

  it("deve cancelar e excluir o pedido com sucesso", async () => {
    // Mock para Order.findOne retornar um pedido com status 'Aberto'
    const orderMock = {
      id: "1",
      status: "Aberto",
      save: jest.fn(),
      destroy: jest.fn(),
    };
    (Order.findOne as jest.Mock).mockResolvedValue(orderMock);

    // Chama a função execute e verifica se o pedido é atualizado e excluído
    await deleteOrderService.execute("1");

    // Verifica se o status foi alterado para 'Cancelado' e se os métodos save e destroy foram chamados
    expect(orderMock.status).toBe("Cancelado");
    expect(orderMock.save).toHaveBeenCalledTimes(1);
    expect(orderMock.destroy).toHaveBeenCalledTimes(1);
    expect(Order.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });

  // Novo teste 1: Verifica se o método save() é chamado quando o status é alterado para 'Cancelado'
  it("deve chamar o método save() quando o status for alterado para 'Cancelado'", async () => {
    // Mock para Order.findOne retornar um pedido com status 'Aberto'
    const orderMock = {
      id: "1",
      status: "Aberto",
      save: jest.fn(),
      destroy: jest.fn(),
    };
    (Order.findOne as jest.Mock).mockResolvedValue(orderMock);

    // Chama a função execute
    await deleteOrderService.execute("1");

    // Verifica se o método save() foi chamado
    expect(orderMock.save).toHaveBeenCalled();
  });

  // Novo teste 2: Verifica se o método destroy() é chamado quando o status for alterado para 'Cancelado'
  it("deve chamar o método destroy() quando o status for alterado para 'Cancelado'", async () => {
    // Mock para Order.findOne retornar um pedido com status 'Aberto'
    const orderMock = {
      id: "1",
      status: "Aberto",
      save: jest.fn(),
      destroy: jest.fn(),
    };
    (Order.findOne as jest.Mock).mockResolvedValue(orderMock);

    // Chama a função execute
    await deleteOrderService.execute("1");

    // Verifica se o método destroy() foi chamado
    expect(orderMock.destroy).toHaveBeenCalled();
  });
});
