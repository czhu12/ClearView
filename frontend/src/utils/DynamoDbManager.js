import { dynamoDB } from './index';
import AWS from "aws-sdk";

function marshall(item){
  return AWS.DynamoDB.Converter.marshall(item)
}

function unmarshall(item){
  return AWS.DynamoDB.Converter.unmarshall(item)
}

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

    return await this.dynamoDb.scan(params)
  }

  async create({ testType, quality, createdAt, result, id }) {
    const params = { testType, quality, createdAt, result, id };
    const errors = Object.keys(params).filter(x => !params[x]);

    if (errors.length > 0) throw new Error(`Missing params: ${errors.join(", ")}`);

    return await this.dynamoDb.create(params)
  }

  async delete(id) {
    if (!id) throw new Error("Missing id");
    return await this.dynamoDb.delete(id)
  }
}

class DynamoDbManager {
  constructor(table) {
    this.table = table;
  }

  scan(params) {
    const expressionAttributes = {},
          keys = Object.keys(params);

    for (const key of keys) {
      expressionAttributes[`:${key}`] = params[key];
    }

    const filterExpression = keys.map(k => `${k} = :${k}`).join(' AND '),
          expressionAttributeValues = marshall(expressionAttributes),
          unmarshallItems = (items) => items.map(x => unmarshall(x));

    const scanParams = {
      TableName: this.table,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }

    return new Promise((resolve, reject) => {
      dynamoDB.scan(scanParams, function (err, data) {
        if (err) reject(err)
        else resolve(unmarshallItems(data.Items))
      })
    })
  }

  create(data){
    const params = {
      TableName: this.table,
      Item: marshall(data),
    }

    return new Promise((resolve, reject) => {
      dynamoDB.putItem(params, function (err, data) {
        if (err) reject(err)
        else resolve(unmarshall(data.Item))
      })
    })
  }

  delete(id) {
    const params = {
      TableName: this.table,
      Key: marshall({id})
    }
    return new Promise((resolve, reject) => {
      dynamoDB.deleteItem(params, function (err, _) {
        if (err) reject(err)
        else resolve(id)
      })
    })
  }
  
}