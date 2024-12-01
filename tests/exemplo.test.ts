import supertest from "supertest"; // Usando import
import { Response } from "supertest"; // Tipo correto para a resposta

const request = supertest("https://www.google.com/");

test("devo responder ao status 200", () => {
  return request.get("/").then((res: Response) => {
    expect(res.status).toBe(200);
  });
});
