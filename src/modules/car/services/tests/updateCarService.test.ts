import { AppError } from "../../../../shared/errors/AppError";
import Car from "../../models/car.model";
import UpdateCarService from "../updateCarService";

jest.mock("../../models/car.model", () => ({
  findOne: jest.fn(),
  update: jest.fn(),
}));

describe("UpdateCarService", () => {
  const updateCarService = new UpdateCarService();
  const mockCar = {
    id: "1",
    plate: "ABC1234",
    brand: "Brand A",
    model: "Model A",
    km: 10000,
    year: 2020,
    items: ["Airbags"],
    price: 20000,
    status: "active",
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if car is not found", async () => {
    (Car.findOne as jest.Mock).mockResolvedValue(null); // Car not found

    await expect(
      updateCarService.execute("non-existing-id", { plate: "XYZ9876" })
    ).rejects.toThrow(new AppError("Car not found", 404));
  });

  it('should throw an error if car has status "deleted"', async () => {
    const deletedCar = { ...mockCar, status: "deleted" };
    (Car.findOne as jest.Mock).mockResolvedValue(deletedCar);

    await expect(
      updateCarService.execute("1", { plate: "XYZ9876" })
    ).rejects.toThrow(
      new AppError("Cannot update a car with status deleted", 400)
    );
  });

  it("should throw an error if items are invalid", async () => {
    const invalidItems = { ...mockCar, items: ["Airbags", "ABS", "Airbags"] };
    (Car.findOne as jest.Mock).mockResolvedValue(invalidItems);

    await expect(
      updateCarService.execute("1", { items: ["Airbags", "ABS", "Airbags"] })
    ).rejects.toThrow(
      new AppError("Items must be unique and cannot exceed five.", 400)
    );

    // Test exceeding items
    await expect(
      updateCarService.execute("1", {
        items: ["Airbags", "ABS", "GPS", "Camera", "Sensor", "Sunroof"],
      })
    ).rejects.toThrow(
      new AppError("Items must be unique and cannot exceed five.", 400)
    );
  });

  it("should throw an error if year is too old", async () => {
    const oldYearCar = { ...mockCar, year: 2000 };
    (Car.findOne as jest.Mock).mockResolvedValue(oldYearCar);

    await expect(updateCarService.execute("1", { year: 2000 })).rejects.toThrow(
      new AppError("The year of the car must be within the last 11 years.", 400)
    );
  });

  it("should throw an error if plate already exists for another car", async () => {
    const existingCar = { ...mockCar, id: "2" };
    (Car.findOne as jest.Mock).mockResolvedValue(existingCar); // Car with the same plate

    await expect(
      updateCarService.execute("1", { plate: "ABC1234" })
    ).rejects.toThrow(
      new AppError("A car with this plate already exists.", 400)
    );
  });

  it("should successfully update car details", async () => {
    (Car.findOne as jest.Mock).mockResolvedValue(mockCar); // Mocking car found

    const updatedCarData = {
      plate: "XYZ9876",
      brand: "Brand B",
      model: "Model B",
    };
    await updateCarService.execute("1", updatedCarData);

    expect(Car.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(mockCar.update).toHaveBeenCalledWith(updatedCarData);
  });
});
