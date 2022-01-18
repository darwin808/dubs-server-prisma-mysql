const { PrismaClient } = require("@prisma/client");
const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};

const imageUrl = process.env.UPLOAD_URL;
const videoUrl = process.env.VIDEO_UPLOAD_URL;
const userUrl = process.env.API + "/user";

exports.handler = async (event, context, callback) => {
  const { title, message, thread_id, page_id, media } = JSON.parse(event.body);
  const ipAddress = event.headers["X-Forwarded-For"].split(", ")[0];
  const email = `Anonymous- ${uuidv4()}`;
  try {
    const isThreadExist = await prisma.thread.findUnique({
      where: {
        id: thread_id,
      },
    });
    if (!isThreadExist) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Try Again",
        }),
      };
    }
    const isImage = media && media.includes("image") ? imageUrl : videoUrl;
    const createdUser = await axios.post(userUrl, { ipAddress, email });
    const newMedia = await axios.post(isImage, { file: media });

    const newPost = await prisma.post.create({
      data: {
        title,
        message,
        user_id: Number(createdUser.data.user.id) || 2,
        thread_id,
        page_id,
        media: newMedia?.data?.uploadResult?.Location || "",
        media_small: newMedia?.data?.uploadResult_small?.Location || "",
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
