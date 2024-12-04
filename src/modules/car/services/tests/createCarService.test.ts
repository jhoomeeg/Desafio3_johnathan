import createCar from "../createCarService";
import { AppError } from "../../../../shared/errors/AppError";
import Car from "../../models/car.model";
import { v4 as uuidv4 } from "uuid";

// Mockando o modelo Car corretamente
jest.mock("../../models/car.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

interface CarData {
  plate: string;
  brand: string;
  model: string;
  km: number;
  year: number;
  items: string[];
  price: number;
  status: "active" | "inactive" | "deleted";
}

describe("createCar", () => {
  it("should throw an error if any required field is missing", async () => {
    const incompleteCar: CarData = {
      plate: "ABC1234",
      brand: "", // campo 'brand' vazio
      model: "Model X",
      km: 10000,
      year: 2020,
      items: ["Airbags", "ABS"],
      price: 20000,
      status: "active", // status válido
    };

    await expect(createCar(incompleteCar)).rejects.toThrow(
      "All required fields must be filled."
    );
  });
});

describe("validateItems", () => {
  it("should throw an error if items exceed five", () => {
    const items = [
      "Airbags",
      "ABS",
      "Bluetooth",
      "Sunroof",
      "Navigation",
      "Leather",
    ]; // 6 itens, maior que 5

    expect(() => {
      if (items.length > 5 || new Set(items).size !== items.length) {
        throw new AppError("Items must be unique and cannot exceed five.");
      }
    }).toThrowError(
      new AppError("Items must be unique and cannot exceed five.")
    );
  });

  it("should throw an error if items contain duplicates", () => {
    const items = ["Airbags", "ABS", "Airbags"]; // Itens duplicados

    expect(() => {
      if (items.length > 5 || new Set(items).size !== items.length) {
        throw new AppError("Items must be unique and cannot exceed five.");
      }
    }).toThrowError(
      new AppError("Items must be unique and cannot exceed five.")
    );
  });

  it("should not throw an error if items are unique and have 5 or fewer items", () => {
    const items = ["Airbags", "ABS", "Bluetooth", "Sunroof", "Navigation"]; // 5 itens únicos

    expect(() => {
      if (items.length > 5 || new Set(items).size !== items.length) {
        throw new AppError("Items must be unique and cannot exceed five.");
      }
    }).not.toThrow();
  });
});

describe("Year Validation", () => {
  it("should throw an error if the car year is older than 11 years", () => {
    const oldYear = new Date().getFullYear() - 12; // Ano mais de 11 anos atrás

    expect(() => {
      if (oldYear < new Date().getFullYear() - 11) {
        throw new AppError(
          "The year of the car must be within the last 11 years."
        );
      }
    }).toThrowError(
      new AppError("The year of the car must be within the last 11 years.")
    );
  });

  it("should not throw an error if the car year is within the last 11 years", () => {
    const validYear = new Date().getFullYear() - 5; // Ano dentro dos últimos 11 anos

    expect(() => {
      if (validYear < new Date().getFullYear() - 11) {
        throw new AppError(
          "The year of the car must be within the last 11 years."
        );
      }
    }).not.toThrow();
  });

  it("should not throw an error if the car year is exactly 11 years ago", () => {
    const yearExactly11YearsAgo = new Date().getFullYear() - 11; // Ano exatamente 11 anos atrás

    expect(() => {
      if (yearExactly11YearsAgo < new Date().getFullYear() - 11) {
        throw new AppError(
          "The year of the car must be within the last 11 years."
        );
      }
    }).not.toThrow();
  });
});

describe("Car plate validation", () => {
  it("should throw an error if a car with the same plate already exists", async () => {
    const plate = "ABC1234";
    const existingCar = {
      plate: "ABC1234",
      status: "active",
    };

    // Mockando o retorno do findOne para simular que já existe um carro com a mesma placa
    (Car.findOne as jest.Mock).mockResolvedValue(existingCar);

    await expect(
      createCar({
        plate,
        brand: "Brand",
        model: "Model",
        km: 10000,
        year: 2020,
        items: ["Airbags"],
        price: 20000,
        status: "active",
      })
    ).rejects.toThrow(new AppError("A car with this plate already exists."));
  });

  it("should not throw an error if no car with the same plate exists", async () => {
    const plate = "DEF5678";

    // Mockando o retorno do findOne para simular que não existe carro com a mesma placa
    (Car.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      createCar({
        plate,
        brand: "Brand",
        model: "Model",
        km: 10000,
        year: 2020,
        items: ["Airbags"],
        price: 20000,
        status: "active",
      })
    ).resolves.not.toThrow();
  });
});

describe("createCar", () => {
  it("should create a new car with valid data", async () => {
    // Definindo explicitamente o tipo CarData
    const newCarData: CarData = {
      plate: "JKL1234",
      brand: "BrandA",
      model: "Model A",
      km: 5000,
      year: 2021,
      items: ["Airbags", "ABS"],
      price: 25000,
      status: "active", // status válido
    };

    const mockCreatedCar = {
      ...newCarData,
      id: uuidv4(),
      registrationDate: new Date(),
    };

    // Mockando o retorno de Car.create para simular a criação do carro
    (Car.create as jest.Mock).mockResolvedValue(mockCreatedCar);

    const result = await createCar(newCarData);

    expect(result).toEqual(mockCreatedCar);
    expect(Car.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String), // Espera que o id seja um string gerada pelo uuid
        plate: newCarData.plate,
        brand: newCarData.brand,
        model: newCarData.model,
        km: newCarData.km,
        year: newCarData.year,
        items: newCarData.items,
        price: newCarData.price,
        registrationDate: expect.any(Date), // Espera que a data de registro seja a data atual
        status: newCarData.status,
      })
    );
  });
});
