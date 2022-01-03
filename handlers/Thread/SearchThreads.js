const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
};
exports.handler = async (event, context, callback) => {
  try {
    const { search } = event.queryStringParameters;

    const result = await prisma.thread.findMany({
      where: {
        title: {
          search,
        },
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error, msg: "Try Again" }),
    };
  }
};
