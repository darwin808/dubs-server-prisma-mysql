const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "POST",
};
exports.handler = async (event, context, callback) => {
  const { username, email, password, role } = JSON.parse(event.body);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const data = {
      username,
      email,
      password: hashPassword,
      role,
    };
    const isEmailExist = await prisma.admins.findUnique({ where: { email } });
    if (isEmailExist) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email already registered" }),
      };
    }
    const { password, ...newUser } = await prisma.admins.create({
      data,
    });

    // const { password, ...newUser } = await JSON.parse(newUser);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: "Success", user: newUser }),
    };
  } catch (error) {
    return { statusCode: 400, headers, body: JSON.stringify({ error }) };
  }
};
