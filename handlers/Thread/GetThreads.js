const { PrismaClient } = require("@prisma/client");
const { createClient } = require("redis");

const prisma = new PrismaClient();
const redis = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

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

    redis.on("error", (err) => console.log("Redis Client Error", err));
    await redis.connect();

    const cachedPost = await redis.get(id);
    console.log(cachedPost, "wwwwwwwwwwwwwwwwwwwwwww");
    if (cachedPost)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          threads: cachedPost,
          totalItems: totalItems,
          currentPage,
          itemsPerPage,
          lastPage,
          sort,
        }),
      };

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

    redis.set(id, JSON.stringify(threads));

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
