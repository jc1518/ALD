import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface DynamoDbProps {
  name: string;
  partitionKey: string;
}

export class DynamoDb extends Construct {
  readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DynamoDbProps) {
    super(scope, id);

    const table = new dynamodb.Table(this, props.name, {
      tableName: props.name,
      partitionKey: {
        name: props.partitionKey,
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.table = table;
  }
}
