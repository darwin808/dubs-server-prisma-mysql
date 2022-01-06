const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
};
exports.handler = async (event, context, callback) => {
  try {
    const ipAddress = event.headers["X-Forwarded-For"].split(", ")[0];
    const { id } = event.pathParameters;
    const findUser = await prisma.user.findUnique({
      where: {
        ipAddress,
      },
    });
    console.log(id, findUser);
    if (!findUser) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          msg: "user not found",
        }),
      };
    }
    const deletedthread = await prisma.thread.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        deletedthread,
        msg: "Success",
      }),
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
