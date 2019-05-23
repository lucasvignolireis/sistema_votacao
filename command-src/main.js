#!/usr/bin/env node

//'use strict';

const program = require("commander");
const Parse = require('parse/node');
Parse.initialize("gzJUUs9GDBjNshWTAgzXKTIgq3yqN0CdmYp6UI9e", "oxpwv0i6pxMFZSrFRnaNiVA5JIgybCbh47YLvxaR")
Parse.serverURL="https://parseapi.back4app.com/";

program.version('1.0.0')
    .parse(process.argv);

console.info("Mandando emails para o pessoal");
const Voters = Parse.Object.extend("Voters");

const query = new Parse.Query(Voters);

query.find().then(function (results) {
    if (results.length < 0) {
        console.info("Não encontrou nenhum email");
    }

    for (var i = 0; i < results.length; i++) {

        var to = "", name = "";

        if (typeof results[i].attributes.name != "undefined") {
            to += results[i].attributes.name.trim();
            name += results[i].attributes.name.trim();
        }

        if (typeof results[i].attributes.surname != "undefined") {
            to += " " + results[i].attributes.surname.trim();
            name += " " + results[i].attributes.surname.trim();
        }
        to = to.trim();

        to += " <" + results[i].attributes.email + ">";

        console.info("Sending to: "+to);

        const sgMail = require('@sendgrid/mail');
        // Import SendGrid module and call with your SendGrid API Key
        sgMail.setApiKey("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");

        var msg = {
            to: to,
            replyTo: 'nao-responda@preface.com.br',
            from: 'nao-responda@preface.com.br',
            subject: "Eleições SBFoton / Chapa 2019—2021",
            html: "Caro(a) " + name + ","
                + "<br><br>Para votar na eleição da próxima gestão acesse este link:<br> http://votarsbfoton.surge.sh/#/votar/" +results[i].attributes.authKey
                + "<br><br>Você tem até às <strong>16h desta sexta-feira, dia 24 de Maio de 2019</strong> para votar."
                + "<br><br>Este link é único, secreto e permite apenas um voto. Não compartilhe com ninguém."
                + "<br><br>Ao terminar de votar você receberá um código de verificação. Anote-o, pois depois com ele poderá verificar que o seu voto foi corretamente computado."
                + "<br><br>Caso tenha problemas em computar o seu voto, mande um email para contato@preface.com.br."
                + "<br><br>Agradecemos pela sua participação!",
            mail_settings: {
                sandbox_mode: {
                    enable: false
                }
            }
        };

        sgMail.send(msg).then(() => {
            console.info("OK!");
        })
            .catch(error => {
                //Log friendly error
                console.log("Não deu certo!");
            });


        break;
    }
});