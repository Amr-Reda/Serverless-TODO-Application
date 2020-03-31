import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  // let userId = event.requestContext.authorizer['principalId'];

  let items = await getTodosForUser()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
    }
}

async function getTodosForUser() {
  const result = await docClient.scan({
    TableName: todosTable,
    // FilterExpression: 'userId = :userId',
    // ExpressionAttributeValues: {
    //     ':userId': userId,
    // },
  }).promise()

  return result.Items
}