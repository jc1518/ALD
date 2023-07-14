import { Operation } from "./lib/operation";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any = {}): Promise<any> => {
  const params = {
    TableName: TABLE_NAME,
  };

  const operation = new Operation();
  return operation.getItems(params);
};
