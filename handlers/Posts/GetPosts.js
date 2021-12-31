const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
exports.handler = async (event, context, callback) => {
  try {
    const posts = await prisma.post.findMany();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ asdf: posts }),
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
