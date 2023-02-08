import { config } from "dotenv"
import Knex from "knex"

config()

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env['HOST'],
    user: process.env['USERNAME'],
    password: process.env['PASSWORD'],
    database: process.env['DATABASE'],
    port: process.env['PORT'] || 5432,
  }
})

export const handler = async (event) => {
  const res = await knex('items')
  return res

  // TODO implement
  // const response = {
  //   statusCode: 200,
  //   body: res,
  // }
  // return response
}
