import Vue from "vue";
import Router from "vue-router";
import Intro from "./views/Intro.vue";
import TheEnd from "./views/TheEnd.vue";
import VoteCount from "./views/VoteCount.vue";
import InvalidHash from "./views/InvalidHash.vue";
import Question from "./components/Question.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "default"
      //redirect: "/votar/email"
    },
    {
      path: "/votar/:email",
      name: "intro",
      component: Intro
    },
    {
      path: "/fim/:receipt",
      name: "the-end",
      component: TheEnd
    },
    {
      path: "/hash-invalido",
      name: "invalid-hash",
      component: InvalidHash
    },
    {
      path: "/quest/:email/:index",
      name: "question",
      component: Question
    },
    {
      path: "/vote-count",
      name: "vote-count",
      component: VoteCount
    }
  ]
});
