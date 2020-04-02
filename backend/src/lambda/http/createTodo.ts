import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = uuid.v4()
  let userId = event.requestContext.authorizer['principalId'];
  const newItem = await createTodo(userId, event, todoId)

  return {
    statusCode: 201,
       headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(
      {
        item :{
        ...newItem,
      }
    }
    )
  }
}

async function createTodo(userId: string, event: any, todoId: string) {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const newItem = {
    userId,
    todoId,
    ...newTodo,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
  console.log('Storing new item: ', newItem)

  await docClient
    .put({
      TableName: todosTable,
      Item: newItem
    })
    .promise()
  newItem.userId = undefined
  return newItem
}