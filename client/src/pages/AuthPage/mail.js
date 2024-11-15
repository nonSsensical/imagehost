const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "imghost_app@outlook.com",
        pass: "Appforspam1267"
    }
});

const options = {
    from: "imghost_app@outlook.com",
    to: "dead.samura1@yandex.ru",
    subject: "Вадимочке",
    text: "test"
}


export function Send () {
    transporter.sendMail(options, function(err, info){
        if(err) {
            console.log(err)
            return;
        }
        console.log(info.response)
    })
}