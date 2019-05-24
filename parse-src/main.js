const crypto = require('crypto');
const saltyString = 'kj9kazsf87';


Parse.Cloud.define("hello", function(request, response){
 	response.success("Hello world!");
});


Parse.Cloud.define("getBallotBox", function (request, response) {

	response.success({
		"verdura": "alface"
	});
});

Parse.Cloud.beforeSave("Voters", (request, response) => {
	
	// if (request.object.get("name") == "BANANA") {
	// 	response.error("O nome não pode ser BANANA");
	// 	return;
	// }

	//request.object.set('authKey', crypto.createHash('md5').update( request.object.get('email') + 'kj9kazsf87').digest("hex"));

	var buff = new Buffer(request.object.get('email'),'utf8');
	request.object.set('authKey', encodeURIComponent(buff.toString('base64')));

	var query = new Parse.Query('Voters');

	if (typeof request.object.id == "string" && request.object.id.length > 0) {
		query.notEqualTo('objectId', request.object.id);
	}

	query.equalTo('email', request.object.get('email'));
	query.find({useMasterKey:true}).then(function(results) {
		if (results.length > 0) {
			response.error("Não pode ter email repetido");
			return;
		}
		response.success();
	});


	return;
});


Parse.Cloud.beforeSave("Votes", (request, response) => {
	// var query = new Parse.Query('Voters');
	//
	// query.notEqualTo('voted', true);
	// query.equalTo('email', request.object.get('voterEmail'));

	//CLOSED BALLOTS
	response.error("VOTAÇÃO ENCERRADA!");
	return;

	const voterQuery = new Parse.Query('Voters');
	voterQuery.equalTo('email', request.object.get('voterEmail'));
	voterQuery.notEqualTo('voted', true);

	voterQuery.find({useMasterKey:true}).then(function(results) {
		if (results.length == 0) {
			response.error("Usuário já votou, não pode votar duas vezes!");
			return;
		}

		response.success();
	});
});


Parse.Cloud.afterSave("Votes", (request, response) => {
	var query = new Parse.Query('Voters');

	query.equalTo('email', request.object.get('voterEmail'));

	query.first({useMasterKey:true}).then(function(result) {
		if (typeof result == "undefined") {
			response.error("Não conseguiu achar request.object.get('voterEmail'), para atualizar!");
			return;
		}

		result.set("voted", true);

		result.save(null, {useMasterKey: true}).then(function(saveResult) {
			//log.info('Custom log ' + JSON.stringify(saveResult.object))
			response.success();
		});
	});
	response.error("opa não conseguiu salvar o voto de " + request.object.get('voterEmail'));
});


Parse.Cloud.define("sendTestEmail", (request, response) => {

	const sgMail = require('@sendgrid/mail');
	// Import SendGrid module and call with your SendGrid API Key
	sgMail.setApiKey("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");

	const msg = {
		to: "lucas.vignoli.reis@gmail.com",
		replyTo: 'nao-responda@preface.com.br',
		from: 'nao-responda@preface.com.br',
		subject: "Teste",
		text: "Olá Mundo!"
	};

	sgMail.send(msg).then(() => {
		response.success("The message was sent!");
	})
		.catch(error => {
			//Log friendly error
			response.error(error.toString());
		});
});


Parse.Cloud.define("sendBallots", (request, response) => {

	const sgMail = require('@sendgrid/mail');
	// Import SendGrid module and call with your SendGrid API Key
	sgMail.setApiKey("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");

	var query = new Parse.Query('Voters');

	query.find()({useMasterKey:true}).then( function(results){
		if (typeof result == "undefined" || results.length == 0) {
			response.error("Não achou nenhum e-mail para enviar");
		}

		log.info("Encontrou " + results.length + " emails prá enviar!");
		response.success("Encontrou " + results.length + " emails prá enviar!");
	});
});