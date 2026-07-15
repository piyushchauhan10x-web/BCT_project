const rateLimit = require("express-rate-limit");

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20, // 20 generate calls per IP per window
  message: { error: "Too many requests. Try again later." },
});

module.exports = { generateLimiter };