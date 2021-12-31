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
    const posts = await prisma.post.findMany({
      where: {
        thread_id: parseInt(id),
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts }),
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
