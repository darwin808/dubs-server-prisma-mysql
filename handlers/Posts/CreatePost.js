const { PrismaClient } = require("@prisma/client");
const { default: axios } = require("axios");

const prisma = new PrismaClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};

const url = process.env.UPLOAD_URL;

exports.handler = async (event, context, callback) => {
  const { title, message, user_id, thread_id, page_id, media } = JSON.parse(
    event.body
  );
  try {
    const isUserExist = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    const isThreadExist = await prisma.thread.findUnique({
      where: {
        id: thread_id,
      },
    });
    if (!isUserExist || !isThreadExist) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Try Again",
        }),
      };
    }
    const newMedia = (await media) && (await axios.post(url, { file: media }));

    const newPost = await prisma.post.create({
      data: {
        title,
        message,
        user_id,
        thread_id,
        page_id,
        media: newMedia.data.uploadResult.Location || "",
        media_small: newMedia.data.uploadResult_small.Location || "",
      },
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ newPost, msg: "SUCCESS" }),
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
