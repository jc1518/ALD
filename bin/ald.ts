import * as cdk from "aws-cdk-lib";
import { ALDStack } from "../lib/ald-stack";

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const tableName = "items";
const partitionKey = "id";
const stageName = "dev";

new ALDStack(app, "ALD", {
  env: env,
  tableName: tableName,
  partitionKey: partitionKey,
  stageName: stageName,
});
