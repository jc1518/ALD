import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME!;

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

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

  try {
    const command = new GetCommand(params);
    const response = await docClient.send(command);
    if (!response.Item) {
      const error = `no item found for the given id ${id}`;
      console.error(error);
      return {
        statusCode: 404,
        body: console.error(error),
      };
    }
    const item = response.Item;
    console.log(item);
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
