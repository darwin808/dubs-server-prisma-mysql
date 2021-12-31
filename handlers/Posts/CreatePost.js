const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};
exports.handler = async (event, context, callback) => {
  const { title, message, user_id, thread_id } = JSON.parse(event.body);
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!isUserExist) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify("User not Found"),
      };
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        message,
        user_id,
        thread_id,
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ newPost }),
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
