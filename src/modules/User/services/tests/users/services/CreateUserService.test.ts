import CreateUserService from "../../../CreateUserService";
import User from "../../../../models/User";
import { AppError } from "../../../../../../shared/errors/AppError";
import { hash } from "bcryptjs";

// Mock das dependências
jest.mock("../../../../models/User", () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
  };
});

jest.mock("bcryptjs", () => {
  return {
    hash: jest.fn(),
  };
});

describe("CreateUserService", () => {
  let createUserService: CreateUserService;

  beforeEach(() => {
    createUserService = new CreateUserService();
  });

  it("should be able to create a new user with valid data", async () => {
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedPassword",
    };

    const name = "John Doe";
    const email = "john@example.com";
    const password = "validPassword";
    const hashedPassword = "hashedPassword";

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (hash as jest.Mock).mockResolvedValue(hashedPassword);
    (User.create as jest.Mock).mockResolvedValue(user);

    const response = await createUserService.execute({ name, email, password });

    expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(hash).toHaveBeenCalledWith(password, 8);
    expect(User.create).toHaveBeenCalledWith({
      name: name,
      email: email,
      password: hashedPassword,
    });
    expect(response).toBe(user.id);
  });

  it("should throw an error if an account with the same email already exists", async () => {
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedPassword",
    };

    const name = "John Doe";
    const email = "john@example.com";
    const password = "validPassword";

    (User.findOne as jest.Mock).mockResolvedValue(user);

    await expect(
      createUserService.execute({ name, email, password })
    ).rejects.toThrowError(
      new AppError("An account with this email already exists.", 409)
    );
  });

  it("should hash the password correctly", async () => {
    const name = "John Doe";
    const email = "john@example.com";
    const password = "validPassword";
    const hashedPassword = "hashedPassword";

    // Garantindo que o usuário não exista
    (User.findOne as jest.Mock).mockResolvedValue(null);

    // Mock da função de hash
    (hash as jest.Mock).mockResolvedValue(hashedPassword);

    await createUserService.execute({ name, email, password });

    // Verifica que o hash foi chamado
    expect(hash).toHaveBeenCalledWith(password, 8);
  });
});
