import CreateSessionService from "../../../CreateSessionService";
import User from "../../../../models/User";
import { AppError } from "../../../../../../shared/errors/AppError";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from "../../../../../../config/auth";

// Mock de dependências
jest.mock("../../../../models/User", () => {
  return {
    findOne: jest.fn(),
  };
});

jest.mock("bcryptjs", () => {
  return {
    compare: jest.fn(),
  };
});

jest.mock("jsonwebtoken", () => {
  return {
    sign: jest.fn(),
  };
});

describe("CreateSessionService", () => {
  let createSessionService: CreateSessionService;

  beforeEach(() => {
    createSessionService = new CreateSessionService();
  });

  it("should be able to create a session with valid credentials", async () => {
    // Arrange
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedPassword",
    };

    const password = "correctPassword";
    const mockToken = "generatedToken";

    (User.findOne as jest.Mock).mockResolvedValue(user); // Mock do User.findOne
    (compare as jest.Mock).mockResolvedValue(true); // Mock do bcryptjs.compare
    (sign as jest.Mock).mockReturnValue(mockToken); // Mock do jsonwebtoken.sign

    const request = {
      email: "john@example.com",
      password,
    };

    // Act
    const response = await createSessionService.execute(request);

    // Assert
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: request.email },
      raw: true,
    });
    expect(compare).toHaveBeenCalledWith(password, user.password);
    expect(sign).toHaveBeenCalledWith({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });
    expect(response).toEqual({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: mockToken,
    });
  });

  it("should throw an error if user is not found", async () => {
    // Arrange
    (User.findOne as jest.Mock).mockResolvedValue(null); // Mock do User.findOne retornando null

    const request = {
      email: "nonexistent@example.com",
      password: "anyPassword",
    };

    // Act & Assert
    await expect(createSessionService.execute(request)).rejects.toThrowError(
      new AppError(
        "Incorrect email and password combination. Please try again!",
        401
      )
    );
  });

  it("should throw an error if password does not match", async () => {
    // Arrange
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedPassword",
    };

    const password = "wrongPassword";

    (User.findOne as jest.Mock).mockResolvedValue(user); // Mock do User.findOne
    (compare as jest.Mock).mockResolvedValue(false); // Mock do bcryptjs.compare

    const request = {
      email: "john@example.com",
      password,
    };

    // Act & Assert
    await expect(createSessionService.execute(request)).rejects.toThrowError(
      new AppError(
        "Incorrect email and password combination. Please try again!",
        401
      )
    );
  });
});
