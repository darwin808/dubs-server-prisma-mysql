const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
};
exports.handler = async (event, context, callback) => {
  const { id } = event.pathParameters;
  const q1 = event.queryStringParameters;
  const { page, perPage } = event.queryStringParameters || 1;
  try {
    const totalItems = await prisma.thread.findMany();
    const thread = await prisma.thread.findMany({
      take: perPage,
      skip: perPage * (page - 1),
      where: {
        page_id: parseInt(id),
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        thread,
        totalItems: totalItems.length,
        q1,
        page,
        perPage,
      }),
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
