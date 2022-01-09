const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
};
exports.handler = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;
    const { page, perPage } = event.queryStringParameters || 1;
    const currentPage = +page || 1;
    const itemsPerPage = +perPage || 10;
    const sort = "desc";
    const totalItems = await prisma.thread.count();
    const lastPage = await Math.ceil(totalItems / itemsPerPage);

    const threads = await prisma.thread.findMany({
      take: itemsPerPage,
      skip: itemsPerPage * (currentPage - 1),
      where: {
        page_id: parseInt(id),
      },
      orderBy: {
        createdAt: sort,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        threads,
        totalItems: totalItems,
        currentPage,
        itemsPerPage,
        lastPage,
        sort,
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
