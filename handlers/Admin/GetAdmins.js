const { PrismaClient } = require("@prisma/client");

const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};
exports.handler = async (event, context, callback) => {
  const cookie = event.headers.cookie;
  try {
    console.log(jwt.verify(JSON.stringify(cookie), "secret"));
    // const claims = jwt.verify(cookie, "secret");
    // if (!claims) {
    //   return res.status(401);
    // }
    // const user = await User.findOne({ _id: claims._id });
    // const { password, ...data } = await user.toJSON();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: "ok",
        data: { cookie },
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error,
        cookie,
        cookie: "eroro",
      }),
    };
  }
};
