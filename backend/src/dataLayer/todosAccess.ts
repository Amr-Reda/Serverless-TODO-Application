import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexName = process.env.INDEX_NAME) {
    }

    async getTodos(userId: string) {
        console.log(this.indexName);
        
        const result = await this.docClient.scan({
          TableName: this.todosTable,
          FilterExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId,
          },
        }).promise()
      
        return result.Items
    }

    async createTodo(newTodo: any) {
        await this.docClient
          .put({
            TableName: this.todosTable,
            Item: newTodo
          })
          .promise()
        newTodo.userId = undefined
        return newTodo
    }

    async deleteTodo(userId: string, todoId: string) {
        await this.docClient
          .delete({
            Key: {
              todoId: todoId,
              userId: userId
            },
            TableName: this.todosTable,
          })
          .promise()
      
        return
    }

    async updateTodo(todoId: string, updatedTodo: any, userId: string) {
        await this.docClient
          .update({
            TableName: this.todosTable,
            Key: { todoId, userId },
            UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
            ExpressionAttributeValues: {
                ':n': updatedTodo.name,
                ':due': updatedTodo.dueDate,
                ':d': updatedTodo.done
            },
            ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
            }
          })
          .promise()
        return
    }
}