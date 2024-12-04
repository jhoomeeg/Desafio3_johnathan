import UpdateUserService from "../../../UpdateUserService";
import User from "../../../../models/User";
import { AppError } from "../../../../../../shared/errors/AppError";

// Mock do modelo User
jest.mock("../../../../models/User", () => {
  return {
    findOne: jest.fn(),
    update: jest.fn(),
  };
});

describe("UpdateUserService", () => {
  let updateUserService: UpdateUserService;

  beforeEach(() => {
    updateUserService = new UpdateUserService();
    jest.clearAllMocks();
  });

  it("should throw an error if user is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const id = "nonexistent-id";
    const data = { name: "John Doe", email: "john@example.com" };

    await expect(updateUserService.execute(id, data)).rejects.toThrowError(
      "User not found!"
    );

    expect(User.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(User.update).not.toHaveBeenCalled();
  });

  it("should throw an error if email is already in use by another user", async () => {
    const existingUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    };
    const userWithEmail = {
      id: "2",
      name: "Jane Doe",
      email: "john@example.com",
    };

    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(existingUser) // Check for user existence
      .mockResolvedValueOnce(userWithEmail); // Check for email usage

    const id = "1";
    const data = { email: "john@example.com" };

    await expect(updateUserService.execute(id, data)).rejects.toThrowError(
      "An account with this email already exists."
    );

    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(User.findOne).toHaveBeenNthCalledWith(1, { where: { id } });
    expect(User.findOne).toHaveBeenNthCalledWith(2, {
      where: { email: "john@example.com" },
    });
    expect(User.update).not.toHaveBeenCalled();
  });

  it("should update user successfully with valid data", async () => {
    const existingUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce(existingUser);

    const id = "1";
    const data = { name: "John Updated", email: "john.updated@example.com" };

    await updateUserService.execute(id, data);

    //expect(User.findOne).toHaveBeenCalledTimes(1); // Apenas verificando o ID
    expect(User.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(User.update).toHaveBeenCalledWith(data, { where: { id } });
  });

  it("should update user partially when some fields are omitted", async () => {
    const existingUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce(existingUser);

    const id = "1";
    const data = { name: "John Updated" }; // Apenas atualizando o nome

    await updateUserService.execute(id, data);

    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(User.update).toHaveBeenCalledWith(
      { name: "John Updated" },
      { where: { id } }
    );
  });
});
