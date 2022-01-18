const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};
exports.handler = async (event, context, callback) => {
  const { email, password, username } = event.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const isEmailExist = await prisma.user.findUnique({ email });
    if (isEmailExist) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email already registered" }),
      };
    }
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    const { password, ...data } = await newUser.toJSON();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: "Success", data }),
    };
  } catch (error) {
    return res.send({ error });
  }
};
