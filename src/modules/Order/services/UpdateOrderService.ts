import Order from "../models/Order";
import axios from "axios";
import { UUID } from "crypto";
import { AppError } from "../../../shared/errors/AppError";

interface ExecuteParams {
  id: UUID | string;
  DataInicial: Date;
  DataFinal: Date;
  CEP: string;
  status: "Aberto" | "Aprovado" | "Cancelado";
}

export default class UpdateOrderService {
  static execute(orderData: {
    id: number;
    DataInicial: Date;
    DataFinal: Date;
    CEP: string;
    status: string;
  }) {
    throw new Error("Method not implemented.");
  }
  public async execute({
    id,
    DataInicial,
    DataFinal,
    CEP,
    status,
  }: ExecuteParams) {
    // Verificar se o pedido existe
    const order = await Order.findByPk(id);
    if (!order) {
      throw new AppError("Pedido não encontrado!", 404);
    }

    // Verificar se a DataInicial é menor que a data de hoje
    const today = new Date();
    if (DataInicial < today) {
      throw new AppError(
        "O pedido deve estar em aberto para ser aprovado",
        400
      );
    }

    // Verificar se a DataFinal é menor que a DataInicial
    if (DataFinal < DataInicial) {
      throw new AppError(
        "A data final não pode ser anterior à data inicial",
        400
      );
    }

    // Update do CEP
    let Cidade = null;
    let UF = null;

    if (CEP) {
      const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
      const data = response.data;

      if (data && !data.erro) {
        const ufs = [
          "AL",
          "BA",
          "CE",
          "MA",
          "PB",
          "PE",
          "PI",
          "RN",
          "SE",
          "SP",
        ];
        if (!ufs.includes(data.uf)) {
          throw new AppError(
            `${data.uf} no momento não temos filiais nessa região`,
            400
          );
        }
        Cidade = data.localidade;
        UF = data.uf;
      }

      if (data.erro) {
        throw new AppError("CEP inválido", 400);
      }
    }

    // Verificação de status
    if (status === "Aprovado") {
      if (order.status !== "Aberto") {
        throw new AppError(
          "O pedido deve estar em aberto para ser aprovado",
          400
        );
      }
      if (!id || !DataInicial || !DataFinal || !CEP || !status) {
        throw new AppError(
          "Todos os campos devem estar preenchidos para aprovar o pedido",
          400
        );
      }
    }

    if (status === "Cancelado") {
      if (order.status !== "Aberto") {
        throw new AppError(
          "O pedido deve estar em aberto para ser cancelado",
          400
        );
      }
      order.DataCancelamento = today;
    }

    // Atualizar pedido
    await order.update({
      DataInicial,
      DataFinal,
      CEP,
      Cidade,
      UF,
      status,
      DataCancelamento: status === "Cancelado" ? order.DataCancelamento : null,
    });

    return order;
  }
}
