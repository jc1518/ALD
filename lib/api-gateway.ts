import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

export interface ApiGatewayProps {
  name: string;
  description?: string;
  stageName: string;
}

export class ApiGateway extends Construct {
  readonly api: apiGateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const api = new apiGateway.RestApi(this, props.name, {
      restApiName: props.name,
      description: props.description,
      deployOptions: {
        stageName: props.stageName,
      },
    });

    this.api = api;
  }
}
