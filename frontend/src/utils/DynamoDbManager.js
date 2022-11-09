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

  async query({ testType, quality, label, id }, lastEvaluatedKey){
    const params = { testType, quality, label, id };

    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null) {
        delete params[key];
      }
    });

    return await this.dynamoDb.scan(params, lastEvaluatedKey)
  }

  async find(id){
    const data = await this.dynamoDb.scan({id});
    return data.items[0];
  }

  async create({ testType, label, createdAt, id, quality }) {
    const params = { testType, quality, label, id, createdAt };
    const errors = Object.keys(params).filter(x => !params[x]);

    if (errors.length > 0) throw new Error(`Missing params: ${errors.join(", ")}`);

    return await this.dynamoDb.create(params)
  }

  async delete(id, testType) {
    if (!id || !testType) throw new Error("Missing id or testType");
    return await this.dynamoDb.delete({id, testType})
  }
}

export class DynamoDbManager {
  constructor(table) {
    this.table = table;
  }

  scan(params, lastEvaluatedKey) {
    const unmarshallItems = (items) => items.map(x => unmarshall(x));
    const scanParams = {
      TableName: this.table,
    }
    if (lastEvaluatedKey) scanParams.ExclusiveStartKey = lastEvaluatedKey
    if (Object.keys(params).length > 0) {
      const expressionAttributes = {},
      keys = Object.keys(params);

      for (const key of keys) {
        expressionAttributes[`:${key}`] = params[key];
      }

      scanParams.FilterExpression = keys.map(k => `${k} = :${k}`).join(' AND ');
      scanParams.ExpressionAttributeValues = marshall(expressionAttributes);
    }
    return new Promise((resolve, reject) => {
      dynamoDB.scan(scanParams, function (err, data) {
        if (err) reject(err)
        else resolve({lastEvaluatedKey: data.LastEvaluatedKey, items: unmarshallItems(data.Items)})
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

  delete({id, testType}) {
    const params = {
      TableName: this.table,
      Key: marshall({id, testType})
    }
    return new Promise((resolve, reject) => {
      dynamoDB.deleteItem(params, function (err, _) {
        if (err) reject(err)
        else resolve(id)
      })
    })
  }
  
}