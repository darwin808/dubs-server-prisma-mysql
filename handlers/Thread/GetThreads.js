const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
};
exports.handler = async (event, context, callback) => {
  const { id } = event.pathParameters;
  try {
    const thread = await prisma.thread.findMany({
      take: 10,
      skip: 10,
      where: {
        page_id: parseInt(id),
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ thread }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error),
    };
  }
};
