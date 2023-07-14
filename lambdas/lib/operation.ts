import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

export class Operation {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    const dbClient = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(dbClient);

    this.client = docClient;
  }

  async createItem(params: any) {
    try {
      const command = new PutCommand(params);
      await this.client.send(command);
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
  }

  async getItem(params: any) {
    try {
      const command = new GetCommand(params);
      const response = await this.client.send(command);
      if (!response.Item) {
        const error = "no item found for the given id";
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
  }

  async getItems(params: any) {
    try {
      const command = new ScanCommand(params);
      const response = await this.client.send(command);
      const items = response.Items;
      console.log(items);
      return {
        statusCode: 200,
        body: JSON.stringify(items),
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify(err),
      };
    }
  }

  async deleteItem(params: any) {}

  async updateItem(params: any) {}
}
