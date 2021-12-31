const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { headers } = require("../../constants");

exports.handler = async (event, context, callback) => {
  try {
    const users = await prisma.user.findMany();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ users }),
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
