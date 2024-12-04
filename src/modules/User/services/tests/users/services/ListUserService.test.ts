import ListUserService from "../../../ListUserService";
import User from "../../../../models/User";
import { AppError } from "../../../../../../shared/errors/AppError";
import { Op } from "sequelize";

// Mock do modelo User
jest.mock("../../../../models/User", () => {
  return {
    count: jest.fn(),
    findAll: jest.fn(),
  };
});

describe("ListUserService", () => {
  let listUserService: ListUserService;

  beforeEach(() => {
    listUserService = new ListUserService();
  });

  it("should return users with the correct filters, pagination, and order", async () => {
    const mockUsers = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        createdAt: "2024-01-01",
        deletedAt: null,
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane@example.com",
        createdAt: "2024-02-01",
        deletedAt: null,
      },
    ];

    // Mock de contagem de usuários
    (User.count as jest.Mock).mockResolvedValue(2);

    // Mock de busca de usuários
    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const filter = { name: "John", email: "example", justActive: true };
    const order = { nameOrder: "ASC", createOrder: "DESC", deleteOrder: "ASC" };
    const pagination = { page: 1, limit: 10 };

    const response = await listUserService.execute(filter, order, pagination);

    // Verifica a resposta
    expect(response.users).toEqual(mockUsers);
    expect(response.pages).toBe(1);

    // Verifica se o mock de findAll foi chamado com os parâmetros corretos
    expect(User.findAll).toHaveBeenCalledWith({
      attributes: { exclude: ["password"] },
      where: {
        name: { [Op.like]: "%John%" },
        email: { [Op.like]: "%example%" },
      },
      paranoid: true,
      order: [
        ["name", "ASC"],
        ["createdAt", "DESC"],
        ["deletedAt", "ASC"],
      ],
      raw: true,
      offset: 0,
      limit: 10,
    });
  });

  it("should throw an error when no users are found", async () => {
    // Mock de contagem de usuários para retornar 0
    (User.count as jest.Mock).mockResolvedValue(0);

    const filter = {
      name: "Nonexistent",
      email: "nonexistent@example.com",
      justActive: true,
    };
    const order = { nameOrder: "ASC", createOrder: "DESC", deleteOrder: "ASC" };
    const pagination = { page: 1, limit: 10 };

    await expect(
      listUserService.execute(filter, order, pagination)
    ).rejects.toThrowError(AppError);
    await expect(
      listUserService.execute(filter, order, pagination)
    ).rejects.toThrowError("No results match your search.");
  });

  it("should handle pagination correctly", async () => {
    const mockUsers = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        createdAt: "2024-01-01",
        deletedAt: null,
      },
    ];

    // Mock de contagem de usuários
    (User.count as jest.Mock).mockResolvedValue(1);

    // Mock de busca de usuários
    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    const filter = { name: "John", email: "example", justActive: true };
    const order = { nameOrder: "ASC", createOrder: "ASC", deleteOrder: "ASC" };
    const pagination = { page: 2, limit: 1 };

    const response = await listUserService.execute(filter, order, pagination);

    // Verifica a resposta
    expect(response.users).toEqual(mockUsers);
    expect(response.pages).toBe(1);
  });
});
