const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};
exports.handler = async (event, context, callback) => {
  const { username } = JSON.parse(event.body);
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ newUser, event }),
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
