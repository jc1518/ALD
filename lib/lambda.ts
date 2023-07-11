import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { Construct } from "constructs";

export interface LambdaProps {
  tableName: string;
  partitionKey: string;
}

export class Lambda extends Construct {
  readonly createItem: lambda.Function;
  readonly getItem: lambda.Function;
  readonly getItems: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    this.createItem = this.createLambda("createItem", props);
    this.getItem = this.createLambda("getItem", props);
    this.getItems = this.createLambda("getItems", props);
  }

  private createLambda(name: string, props: LambdaProps) {
    const nodeJsFunctionProps: lambdaNodeJs.NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      depsLockFilePath: path.join(__dirname, "../lambdas", "package-lock.json"),
      environment: {
        PRIMARY_KEY: props.partitionKey,
        TABLE_NAME: props.tableName,
      },
      runtime: lambda.Runtime.NODEJS_16_X,
    };

    return new lambdaNodeJs.NodejsFunction(this, name, {
      entry: path.join(__dirname, "../lambdas", `${name}.ts`),
      ...nodeJsFunctionProps,
    });
  }
}
