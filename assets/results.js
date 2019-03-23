import { SQLite } from 'expo'
import { BaseModel, types } from 'expo-sqlite-orm'

const subjectsEN =['Leukocyte','Urobilinogen','Protein','Bilirubin','Glucose','Ascorbic acid','Specific Gravity','Ketone','Nitrite','Creatine','pH','Blood','Calcium'] 

export default class Results extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static get database() {
    return async () => SQLite.openDatabase('urineTest.db')
  }

  static get tableName() {
    return 'results'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
      uid: { type: types.TEXT, unique: true },
      timestamp: { type: types.INTEGER},
      data1: {type:types.FLOAT}, 
      data2: {type:types.FLOAT}, 
      data3: {type:types.FLOAT}, 
      data4: {type:types.FLOAT}, 
      data5: {type:types.FLOAT}, 
      data6: {type:types.FLOAT}, 
      data7: {type:types.FLOAT}, 
      data8: {type:types.FLOAT}, 
      data9: {type:types.FLOAT}, 
      data10: {type:types.FLOAT}, 
      data11: {type:types.FLOAT}, 
      data12: {type:types.FLOAT}, 
      data13: {type:types.FLOAT}, 
      data14: {type:types.FLOAT}, 
    }
  }
}