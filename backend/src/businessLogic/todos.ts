import * as uuid from 'uuid'

import {TodosAccess} from '../dataLayer/todosAccess'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()

export async function getTodos(event: APIGatewayProxyEvent) {
    let userId = event.requestContext.authorizer['principalId'];

    console.log('userId ', userId);
    
    return await todosAccess.getTodos(userId)
}

export async function createTodo(event: APIGatewayProxyEvent) {
    const todoId = uuid.v4()
    let userId = event.requestContext.authorizer['principalId'];
    let newTodo: CreateTodoRequest = JSON.parse(event.body)
    const bucketName = process.env.IMAGES_S3_BUCKET

    let newItem = {
        userId,
        todoId,
        ...newTodo,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    }

    console.log('todoId ', todoId);
    console.log('userId ', userId);
    console.log('newTodo ', newTodo);

    return await todosAccess.createTodo(newItem)
}

export async function deleteTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters.todoId
    let userId = event.requestContext.authorizer['principalId'];

    console.log('todoId ', todoId);
    console.log('userId ', userId);

    return await todosAccess.deleteTodo(todoId)
}

export async function updateTodo(event: APIGatewayProxyEvent) {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    let userId = event.requestContext.authorizer['principalId'];

    console.log('todoId ', todoId);
    console.log('updatedTodo ', updatedTodo);
    console.log('userId ', userId);
    
    return await todosAccess.updateTodo(todoId, updatedTodo)
}
