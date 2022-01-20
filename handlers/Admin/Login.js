const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};
exports.handler = async (event, context, callback) => {
  const { email, password } = JSON.parse(event.body);

  try {
    const user = await prisma.admins.findUnique({ where: { email } });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!user) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "User not Found" }),
      };
    }
    if (!checkPassword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "wrong password" }),
      };
    }
    const token = jwt.sign({ id: user.id }, "secret");
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    return {
      statusCode: 200,
      headers: { ...headers, "Set-Cookie": token },
      body: JSON.stringify({
        success: "ok",
        data: user,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error }),
    };
  }
};
