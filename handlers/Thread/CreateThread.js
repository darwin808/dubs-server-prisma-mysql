const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
exports.handler = async (event, context, callback) => {
  const { title, message, user_id } = JSON.parse(event.body);
  try {
    const newThread = await prisma.thread.create({
      data: {
        title,
        message,
        user_id,
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ newThread }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error),
    };
  }
};
