import { Operation } from "./lib/operation";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any = {}): Promise<any> => {
  const id = event.pathParameters.id;

  if (!id) {
    const error = "id is missing in URL path";
    console.error(error);
    return {
      statusCode: 400,
      body: error,
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };

  const operation = new Operation();
  return operation.getItem(params);
};
