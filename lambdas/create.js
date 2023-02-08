import { config } from "dotenv"
import Knex from "knex"
import { Configuration, OpenAIApi } from "openai"

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
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const handler = async (event) => {

  const body = JSON.parse(event?.body)
  const sent_text = body?.text ?? "This is a test. Do you concur with that?"
  let grade = body?.grade ?? 2
  let gradeText = ''

  if (grade === 1) {
    gradeText = '1st'
  } else if (grade === 2) {
    gradeText = '2nd'
  } else if (grade === 3) {
    gradeText = '3rd'
  } else if (grade !== 'college') {
    gradeText = `{grade}th`
  } else {
    gradeText = "college"
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `As a superior beign in written English, your goal is to change the following text to ${gradeText} grade level:\n\n${sent_text}`,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const res = completion.data.choices[0].text
    console.log("good", res)

    const test = {
      sent_text,
      grade_level: grade,
      converted_text: res,
    }
    await knex('items').insert(test)

    return test


  } catch (error) {
    if (error.response) {
      console.log("bad", error.response.status, error.response.data)
    } else {
      console.log(error.message)
    }
    const response = {
      statusCode: 500,
      body: error.message,
    }
    return response
  }
}
