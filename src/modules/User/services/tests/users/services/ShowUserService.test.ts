import ShowUserService from "../../../ShowUserService";
import User from "../../../../models/User";
import { AppError } from "../../../../../../shared/errors/AppError";

// Mock do modelo User
jest.mock("../../../../models/User", () => {
  return {
    findOne: jest.fn(),
  };
});

describe("ShowUserService", () => {
  let showUserService: ShowUserService;

  beforeEach(() => {
    showUserService = new ShowUserService();
  });

  it("should return a user when found", async () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      createdAt: "2024-01-01",
      deletedAt: null,
    };

    // Mock do método findOne
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const id = "1";
    const user = await showUserService.execute(id);

    // Verifica se o retorno é o usuário correto
    expect(user).toEqual(mockUser);
    // Verifica se o campo de senha foi excluído
    expect(user.password).toBeUndefined();

    // Verifica se o método findOne foi chamado corretamente
    expect(User.findOne).toHaveBeenCalledWith({
      where: { id },
      attributes: { exclude: ["password"] },
    });
  });

  it("should throw an error when the user is not found", async () => {
    // Mock do método findOne para retornar null (usuário não encontrado)
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const id = "nonexistent-id";

    // Verifica se o erro é lançado corretamente
    await expect(showUserService.execute(id)).rejects.toThrow(AppError);
    await expect(showUserService.execute(id)).rejects.toThrow(
      "User not found!"
    );
  });
});
