import CustomerService from "../CustomerServices";
import Customer from "../../models/Customer";
import { AppError } from "../../../../shared/errors/AppError";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

jest.mock("../../models/Customer", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
  findAll: jest.fn(),
}));

describe("CustomerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar um novo cliente com sucesso", async () => {
    const mockCustomer = {
      id: uuidv4(),
      nome: "John Doe",
      email: "john@example.com",
      cpf: "12345678900",
    };
    (Customer.findOne as jest.Mock).mockResolvedValue(null);
    (Customer.create as jest.Mock).mockResolvedValue(mockCustomer);

    const data = {
      nome: "John Doe",
      dataNascimento: new Date("1990-01-01"),
      cpf: "12345678900",
      email: "john@example.com",
      telefone: "123456789",
    };

    const result = await CustomerService.createCustomer(data);

    // Ajuste para verificar corretamente o uso de Op.or
    expect(Customer.findOne).toHaveBeenCalledWith({
      where: expect.objectContaining({
        [Op.or]: expect.arrayContaining([
          { cpf: data.cpf },
          { email: data.email },
        ]),
        deletedAt: null,
      }),
    });
    expect(Customer.create).toHaveBeenCalledWith(expect.objectContaining(data));
    expect(result).toEqual(mockCustomer);
  });

  it("deve lançar um erro se os campos obrigatórios estiverem ausentes", async () => {
    await expect(CustomerService.createCustomer({} as any)).rejects.toThrow(
      AppError
    );
  });

  it("deve lançar um erro se o cliente já existir", async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue({});

    const data = {
      nome: "John Doe",
      dataNascimento: new Date("1990-01-01"),
      cpf: "12345678900",
      email: "john@example.com",
      telefone: "123456789",
    };

    await expect(CustomerService.createCustomer(data)).rejects.toThrow(
      AppError
    );
  });
});

describe("getCustomerById", () => {
  it("deve retornar um cliente existente pelo ID", async () => {
    const mockCustomer = { id: "123", nome: "John Doe" };
    (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

    const result = await CustomerService.getCustomerById("123");

    expect(Customer.findOne).toHaveBeenCalledWith({
      where: { id: "123", deletedAt: null },
    });
    expect(result).toEqual(mockCustomer);
  });

  it("deve lançar um erro se o cliente não for encontrado", async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    await expect(CustomerService.getCustomerById("123")).rejects.toThrow(
      AppError
    );
  });
});

describe("updateCustomer", () => {
  it("deve atualizar os dados de um cliente existente", async () => {
    const mockCustomer = { id: "123", nome: "John Doe", update: jest.fn() };
    (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

    const data = { nome: "John Updated" };
    await CustomerService.updateCustomer("123", data);

    expect(mockCustomer.update).toHaveBeenCalledWith(data);
  });

  it("deve lançar um erro se o cliente não for encontrado", async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      CustomerService.updateCustomer("123", { nome: "John" })
    ).rejects.toThrow(AppError);
  });
});

describe("deleteCustomer", () => {
  it("deve marcar o cliente como deletado", async () => {
    const mockCustomer = { id: "123", update: jest.fn() };
    (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

    await CustomerService.deleteCustomer("123");

    expect(mockCustomer.update).toHaveBeenCalledWith({
      deletedAt: expect.any(Date),
    });
  });

  it("deve lançar um erro se o cliente não for encontrado", async () => {
    (Customer.findOne as jest.Mock).mockResolvedValue(null);

    await expect(CustomerService.deleteCustomer("123")).rejects.toThrow(
      AppError
    );
  });
});
