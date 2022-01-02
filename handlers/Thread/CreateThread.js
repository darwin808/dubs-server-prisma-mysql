const { PrismaClient } = require("@prisma/client");
const { default: axios } = require("axios");

const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};
const url = process.env.UPLOAD_URL;

const userUrl =
  "https://dls4p0djl3.execute-api.us-west-2.amazonaws.com/dev/user";
exports.handler = async (event, context, callback) => {
  const { title, message, page_id, media } = JSON.parse(event.body);
  const ipAddress = event.headers["X-Forwarded-For"].split(", ")[0];
  try {
    const createdUser = await axios.post(userUrl, { username, ipAddress });
    const newMedia = await axios.post(url, { file: media });

    const newThread = await prisma.thread.create({
      data: {
        title,
        message,
        user_id: Number(createdUser.data.user.id) || 2,
        page_id,
        media: newMedia.data.uploadResult.Location || "",
        media_small: newMedia.data.uploadResult_small.Location || "",
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ newThread, msg: "SUCCESS" }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
