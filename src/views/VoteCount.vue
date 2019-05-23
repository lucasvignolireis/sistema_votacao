<template>
  <div>
    <header id="results">
      <h1>{{json.form_heading}} / {{json.form_sub_heading}}</h1>
      <h3>Compilação dos votos</h3>
    </header>
    <div class="results-compilation">
      <h2>Resumo da votação</h2>
      <p>Dos {{voterCount.possibleVoters}} membros convidados a votar, {{voterCount.votersWhoVoted}} ({{Math.round(100*voterCount.voterTurnout)}}%) lançaram seus votos.</p>
      <p>Os resultados foram os seguintes:</p>
      <table>
        <tr>
          <th>Resposta</th>
          <th>Qtd</th>
          <th>%</th>
        </tr>
        <tr v-for="(answer, index) in voteSummary" :key="'answer-' + index">
          <td>{{answer.text}}</td>
          <td>{{answer.n}}</td>
          <td>{{Math.round(100*answer.p)}}%</td>
        </tr>
        <tr class="sum">
          <!-- <td></td> -->
          <td colspan="3">Total de votos: {{answerCount}}</td>
          <!-- <td></td> -->
        </tr>
      </table>

      <h2>Tabela completa de votos</h2>
      <table>
        <tr>
          <th>Você concorda com a chapa apresentada?</th>
          <th>Hash do voto</th>
        </tr>
        <tr v-for="(vote, index) in prettyVotes" :key="'vote-' + index">
          <td>{{vote.text}}</td>
          <td>{{vote.hash}}</td>
        </tr>
      </table>

      <h2>Lista de presença</h2>

      <table>
        <tr>
          <th>Nome</th>
          <th>Votou?</th>
        </tr>
        <tr v-for="(voter, index) in prettyVoters" :key="'voter-' + index">
          <td>{{voter.name}} {{voter.surname}}</td>
          <td>
            <template v-if="voter.voted">Sim</template>
            <template v-else>Não</template>
          </td>
        </tr>
      </table>
    </div>

    <div class="credits">
      <p>
        Plataforma criada pela
        <a href="//www.preface.com.br" target="_blank">Preface</a>.
      </p>
    </div>
  </div>
</template>

<script>
import mock_json from "@/assets/mock_data.json";

export default {
  data() {
    return {
      json: mock_json,
      votes: [],
      voters: []
    };
  },
  computed: {
    prettyVoters: function() {
      let auxVoters = [];
      this.voters.forEach(voter => {
        let voted = true;
        if (typeof voter.attributes.voted === "undefined") {
          voted = false;
        }
        auxVoters.push({
          name: voter.attributes.name,
          surname: voter.attributes.surname,
          voted: voted
        });
      });
      auxVoters.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      return auxVoters;
    },
    prettyVotes: function() {
      let auxVotes = [];
      this.votes.forEach(vote => {
        let text = this.findText(vote.attributes.answers.concorda_chapa);
        auxVotes.push({
          value: vote.attributes.answers.concorda_chapa,
          text: text,
          hash: this.prettyHash(vote.id)
        });
      });
      auxVotes.sort((a, b) => (a.hash > b.hash ? 1 : b.hash > a.hash ? -1 : 0));

      return auxVotes;
    },
    voterCount: function() {
      let votersWhoVoted = 0,
        possibleVoters = 0;
      this.prettyVoters.forEach(voter => {
        if (voter.voted) {
          votersWhoVoted += 1;
        }
        possibleVoters += 1;
      });
      return {
        votersWhoVoted,
        possibleVoters,
        voterTurnout: votersWhoVoted / possibleVoters
      };
    },
    answerCount: function() {
      let n = 0;
      for (var key in this.voteSummary) {
        n += this.voteSummary[key].n;
      }
      return n;
    },
    voteSummary: function() {
      let answers = {};
      let total = 0;
      this.prettyVotes.forEach(vote => {
        if (!(vote.value in answers)) {
          answers[vote.value] = { text: vote.text, n: 0 };
        }
        answers[vote.value].n += 1;
        total += 1;
      });
      for (var key in answers) {
        answers[key].p = answers[key].n / total;
      }
      return answers;
    }
  },
  beforeRouteEnter: function(to, from, next) {
    const Votes = Parse.Object.extend("Votes");
    const Voters = Parse.Object.extend("Voters");
    var query1 = new Parse.Query(Votes);
    var query2 = new Parse.Query(Voters);
    query1.find().then(result1 => {
      query2.find().then(result2 => {
        next(vm => vm.setData(result1, result2));
      });
    });
  },
  methods: {
    findText: function(value) {
      let text = "Value not found";
      this.json.content_flow[0].options.forEach(option => {
        if (option.value == value) {
          text = option.text;
        }
      });
      return text;
    },
    prettyHash: function(hash) {
      return hash.slice(0, 3) + "." + hash.slice(-3);
    },
    setData(votes, voters) {
      this.votes = votes;
      this.voters = voters;
    }
  },
  name: "vote-count"
};
</script>
