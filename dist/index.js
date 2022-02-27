const express = require("express");
const { createCaptcha } = require("./dto/Express-captcha");
const app = express();
const expressCaptcha = createCaptcha();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressCaptcha.captchaHanlder);

app.use("/", (req, res, next) => {
    res.json({ success: true });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("server open!!");
});
