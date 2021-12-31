const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { headers } = require("../../constants");

exports.handler = async (event, context, callback) => {
  const { title, message } = JSON.parse(event.body);
  try {
    const newThread = await prisma.thread.create({
      data: {
        title,
        message,
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
