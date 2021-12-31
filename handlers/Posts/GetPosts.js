const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.handler = async (event, context, callback) => {
  try {
    // const posts = await prisma.post.findMany({
    //   include: { author: true },
    // });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ asdf: "sadklfjaskldjflkas" }),
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
