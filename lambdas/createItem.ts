import { Operation } from "./lib/operation";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any = {}): Promise<any> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: "invalid request, no payload",
    };
  }
  console.log(event.body);

  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);

  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };

  const operation = new Operation();
  return operation.createItem(params);
};
