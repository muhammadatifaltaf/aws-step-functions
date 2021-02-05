import * as cdk from '@aws-cdk/core';
import lambda = require("@aws-cdk/aws-lambda");
import * as DynamoDB from "@aws-cdk/aws-dynamodb";
import * as stepFunctions from "@aws-cdk/aws-stepfunctions";
import * as stepFunctionTasks from "@aws-cdk/aws-stepfunctions-tasks";

export class CdksfStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // create a dynamodb table
    const DynamoTable = new DynamoDB.Table(this, "DynamoTable", {
      partitionKey: {
        name: "id",
        type: DynamoDB.AttributeType.STRING,
      },
    });
    // The code adds data to the dynamodb table
    const addData = new lambda.Function(this, "addData", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "addData.hanlder",
    });
    const echoStatus = new lambda.Function(this, "echoStatus", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "echoStatus.hanlder",
    });
    DynamoTable.grantFullAccess(addData);
    addData.addEnvironment("DynamoTable", DynamoTable.tableName);
    //creating steps for the step function
    const firstStep = new stepFunctionTasks.LambdaInvoke(
      this,
      "Invoke addData lambda",
      {
        lambdaFunction: addData,
      }

    );
    const secondStep = new stepFunctionTasks.LambdaInvoke(
      this,
      "Invoke echoStatus lambda",
      {
        lambdaFunction: echoStatus,
        inputPath: "$.Payload",
      }
    );
    // creating chain to define the sequence of execution
    const chain = stepFunctions.Chain.start(firstStep).next(secondStep);
    // create s state machine
    new stepFunctions.StateMachine(this, "simpleStateMachine", {
      definition: chain,
    });
  }
}
