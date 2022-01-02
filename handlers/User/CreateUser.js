const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};
exports.handler = async (event, context, callback) => {
  const { username, ipAddress } = JSON.parse(event.body);
  // const ipAddress = event.headers["X-Forwarded-For"].split(", ")[0];
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        username: "1231231231",
      },
    });
    if (!isUserExist) {
      const newUser = await prisma.user.create({
        data: {
          username,
          ipAddress,
        },
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: newUser,
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: isUserExist,
        }),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(error),
    };
  }
};
