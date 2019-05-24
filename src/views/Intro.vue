<template>
  <div>
    <article id="intro">
      <header>
        <h1>{{json.form_heading}}</h1>
        <h2>{{json.form_sub_heading}}</h2>
      </header>
      <p v-for="paragraph in json.intro.text">{{paragraph}}</p>
      <div class="questions-navigation">
        <button disabled href="#" class="question-nav-link"> VOTAÇÃO ENCERRADA</button>
<!--        <router-link class="question-nav-link next-question" :to="nextUrl">Começar a responder</router-link>-->
      </div>
    </article>
  </div>
</template>

<script>
import mock_json from "@/assets/mock_data.json";

export default {
  data() {
    return {
      json: mock_json,
      nextUrl: '/quest/'+ encodeURIComponent(this.$route.params.email) + '/0'
    };
  },
  beforeRouteEnter: function (to, from, next) {
    const Voters = Parse.Object.extend("Voters")
    var query = new Parse.Query(Voters);

    next("/vote-count");
    return;

    query.equalTo("email",atob(to.params.email));
    query.first().then(function(result){
      if (typeof result.get("voted") != "undefined" && result.get("voted") == true) {
        next("/hash-invalido");
        return;
      }
      next();
    });
  },
  name: "intro"
};
</script>
