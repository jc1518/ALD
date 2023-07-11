import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME!;

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

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

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    return {
      statusCode: 200,
      body: "item has been created successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
