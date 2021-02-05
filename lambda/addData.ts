const { DynamoDB } = require("aws-sdk");
exports.handler = async () => {
    const dynamo = new DynamoDB();
    var generated = Date.now();
    var idString = generated.toString();
    const params = {
        TableName: process.env.DynamoTable,
        item: {
            id: { S: idString },
            message: { S: "New Entry Added" },
        },
    };
    try {
        await dynamo.putitem(params).promise();
        return { operationSuccessful: true };

    } catch (err) {
        console.log("DynamoDB error: ", err);
        return { operationSuccessful: false };
    }
};