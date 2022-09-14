import { dynamoDB } from './index';
import AWS from "aws-sdk";

export class InferenceDynamoDb {
  constructor(){
    this.dynamoDb = new DynamoDbManager("Primaryhealth-inference");
  }

  async query({ testType, quality, createdAt, result, id }){
    const params = { testType, quality, createdAt, result, id };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });    

    const keys = Object.keys(params),
          expressionAttributes = {};

    for (const key of keys) {
      expressionAttributes[`:${key}`] = params[key];
    }

    const filterExpression = keys.map(k => `${k} = :${k}`).join(' AND '),
          expressionAttributeValues = this.dynamoDb.marshall(expressionAttributes);

    return await this.dynamoDb.scan(
      filterExpression,
      expressionAttributeValues
    )
  }
}

class DynamoDbManager {
  constructor(table) {
    this.table = table;
  }

  marshall(item){
    return AWS.DynamoDB.Converter.marshall(item)
  }

  unmarshallItems(items){
    return items.map(item => AWS.DynamoDB.Converter.unmarshall(item))
  }

  scan(filterExpression, expressionAttributeValues) {
    const unmarshallItems = this.unmarshallItems;
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.table,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues
      }
      dynamoDB.scan(params, function (err, data) {
        if (err) reject(err)
        else resolve(unmarshallItems(data.Items))
      })
    })
  }
  
  writeData(item) {
    return new Promise((resolve, reject) => {

      const params = {
        ReturnValues: 'NONE',
        TableName: this.table,
        Item: item
      }

      this.client.put(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
  
  delete() {
    return true
  }
  
  }