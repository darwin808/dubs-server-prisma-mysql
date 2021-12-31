const { PrismaClient } = require("@prisma/client");
const { headers } = require("../../constants");

const prisma = new PrismaClient();

exports.handler = async (event, context, callback) => {
  try {
    const thread = await prisma.thread.findMany();
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
