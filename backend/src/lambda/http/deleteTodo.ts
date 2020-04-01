import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  let userId = event.requestContext.authorizer['principalId'];

  console.log(todoId);
  
  await deleteTodosForUser(userId, todoId)
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}

async function deleteTodosForUser(userId: string, todoId: string) {
  await docClient
    .delete({
      Key: {
        todoId: todoId,
        userId: userId
      },
      TableName: todosTable,
    })
    .promise()

  return
}