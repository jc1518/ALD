import * as cdk from "aws-cdk-lib";
import * as apiGw from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { DynamoDb } from "./dynamodb";
import { Lambda } from "./lambda";
import { ApiGateway } from "./api-gateway";
import { table } from "console";

export interface ALDStackProps extends cdk.StackProps {
  tableName: string;
  partitionKey: string;
  stageName: string;
}

export class ALDStack extends cdk.Stack {
  constructor(app: Construct, id: string, props: ALDStackProps) {
    super(app, id, props);

    const scheduleTable = new DynamoDb(this, "DynamoDb", {
      name: props.tableName,
      partitionKey: props.partitionKey,
    }).table;

    const scheduleLambda = new Lambda(this, "Lambda", {
      tableName: props.tableName,
      partitionKey: props.partitionKey,
    });

    const scheduleApi = new ApiGateway(this, "ApiGateway", {
      name: props.tableName,
      stageName: props.stageName,
    }).api;

    const plan = scheduleApi.addUsagePlan("UsagePlan", {
      name: "Easy",
      throttle: {
        rateLimit: 5,
        burstLimit: 2,
      },
    });

    const key = scheduleApi.addApiKey("ApiKey");
    plan.addApiKey(key);
    plan.addApiStage({ stage: scheduleApi.deploymentStage });

    scheduleTable.grantReadWriteData(scheduleLambda.createItem);
    scheduleTable.grantReadData(scheduleLambda.getItem);
    scheduleTable.grantReadData(scheduleLambda.getItems);

    const createItem = new apiGw.LambdaIntegration(scheduleLambda.createItem);

    const getItem = new apiGw.LambdaIntegration(scheduleLambda.getItem);

    const getItems = new apiGw.LambdaIntegration(scheduleLambda.getItems);

    const items = scheduleApi.root.addResource("items");
    items.addMethod("GET", getItems, { apiKeyRequired: true });
    addCorsOptions(items);

    const item = scheduleApi.root.addResource("item");
    item.addMethod("POST", createItem, { apiKeyRequired: true });
    const itemId = item.addResource("{id}");
    itemId.addMethod("GET", getItem, { apiKeyRequired: true });
    addCorsOptions(item);
  }
}

function addCorsOptions(apiResource: apiGw.IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new apiGw.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: apiGw.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
