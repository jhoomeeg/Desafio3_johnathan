import DeleteUserService from "../../../DeleteUserService";
import User from "../../../../models/User";
import { AppError } from "../../../../../../shared/errors/AppError";

jest.mock("../../../../models/User"); // Mock do modelo User

describe("DeleteUserService", () => {
  let deleteUserService: DeleteUserService;

  beforeEach(() => {
    deleteUserService = new DeleteUserService();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa mocks após cada teste
  });

  it("deve deletar um usuário existente", async () => {
    // Mock do método findOne e destroy
    const mockUser = { id: "123", name: "John Doe" };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (User.destroy as jest.Mock).mockResolvedValue(1); // Simula deleção bem-sucedida

    await expect(deleteUserService.execute("123")).resolves.not.toThrow();

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: "123" } });
  });

  it("deve lançar um erro se o usuário não for encontrado", async () => {
    // Mock do método findOne retornando null
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(deleteUserService.execute("123")).rejects.toBeInstanceOf(
      AppError
    );
    await expect(deleteUserService.execute("123")).rejects.toHaveProperty(
      "message",
      "User not found!"
    );
    await expect(deleteUserService.execute("123")).rejects.toHaveProperty(
      "statusCode",
      404
    );

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
    expect(User.destroy).not.toHaveBeenCalled(); // Verifica que destroy não foi chamado
  });
});
