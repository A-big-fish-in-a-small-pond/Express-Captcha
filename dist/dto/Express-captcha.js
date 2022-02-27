const fs = require("fs");
const { options } = require("../const/options");
const { createKey, enCrypt } = require("../util/aes");
const { Session } = require("../vo/session");

function ExpressCaptcha(opt = options) {
    this.session = new Session();
    this.count = 4;
    this.opt = opt;
    this.key = null;
    this.directory = __dirname.substring(0, __dirname.lastIndexOf("\\")) + "\\img\\";
}

ExpressCaptcha.prototype.createCaptcha = function (opt, store) {
    this.opt = opt;
    this.init(store);
};

/** init method start */
ExpressCaptcha.prototype.init = function (store) {
    this.key = createKey(this.opt.key);
    this.setSession(store);
    this.renameImage();
};

ExpressCaptcha.prototype.setSession = function (store) {
    if (this.opt.store !== "default" && typeof store !== "undefined") {
        this.session.setStore(store);
    } else {
        this.session.setStore(new Map());
    }
};

ExpressCaptcha.prototype.renameImage = function () {
    for (let i = 0; i < 10; i++) {
        let origin = "num_" + i;
        let encrpted = enCrypt(origin, this.key);

        let data = fs.readFileSync(this.directory + origin + ".gif", {
            encoding: "binary",
        });

        fs.writeFileSync(this.directory + encrpted + ".gif", data, {
            encoding: "binary",
        });
    }
};
/** init method end */

/** Captcha function */
ExpressCaptcha.prototype.getChptcha = function () {
    let arr = [];
    for (let i = 0; i < this.count; i++) {
        let a = Number(Math.random() * 9).toFixed(0);
        arr.push(a);
    }
    return arr;
};

ExpressCaptcha.prototype.sessionObject = function (success, expire) {
    return {
        success: success,
        expire: expire,
        code: null,
    };
};

ExpressCaptcha.prototype.captchaHanlder = function (req, res, next) {
    let ipv4 = enCrypt(req.ip, expressCaptcha.key);
    let path = req.path;
    let method = req.method;
    let auth = expressCaptcha.session.getSession(ipv4);

    if (expressCaptcha.opt.authPath.some((v) => v == path) == false) {
        return next();
    }

    if (typeof auth == "undefined") {
        let arr = expressCaptcha.getChptcha();
        expressCaptcha.session.setSession(ipv4, expressCaptcha.sessionObject(false, null));
        return expressCaptcha.createHTML(res, arr);
    }

    next();
};

ExpressCaptcha.prototype.createHTML = function (res, arr) {
    res.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>사용자 인증 절차</title>
    </head>
    <body>
        <h2 style="margin: 50px 40px">캡차 인증</h2>
        <h6 style="margin: 0px 40px">
            아래 보이는 문자를 적어 본인이 로봇이 아님을 증명하세요.
        </h6>
        <canvas
            id="mycanvas"
            style="background-color: antiquewhite; margin: 30px 40px"
        >
        </canvas>
        <form
            action="${this.opt.sendAuthPath}"
            method="post"
            style="margin: 0px 40px"
        >
            <input
                type="text"
                id="text"
                name="text"
                style="width: 750px; padding: 10px 30px"
            />
            <input
                type="submit"
                value="제출"
                style="width: 200px; padding: 10px 30px"
            />
        </form>
    </body>`);

    res.write("<script>");
    res.write('var canvas = document.getElementById("mycanvas");');
    res.write("canvas.width = 1000;");
    res.write("canvas.height = 300;");
    res.write('var context = canvas.getContext("2d");');
    for (let i = 0; i < arr.length; i++) {
        let data = fs.readFileSync(expressCaptcha.directory + enCrypt("num_" + arr[i], expressCaptcha.key) + ".gif");
        res.write(`var img${i} = new Image();`);
        res.write(`img${i}.src ="data:image/jpeg;base64,${Buffer.from(data).toString("base64")}";`);
        res.write(`img${i}.addEventListener("load", () => {
            context.drawImage(img${i}, ${i * 200 + 80}, 50, 200, 200);
        });`);
    }
    res.end("</script></html>");
    return;
};

const expressCaptcha = new ExpressCaptcha();

module.exports.createCaptcha = (opt = options, store) => {
    expressCaptcha.createCaptcha(opt, store);
    return expressCaptcha;
};
