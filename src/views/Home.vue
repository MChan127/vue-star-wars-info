<template>
    <div class="home">
        <h1>Welcome to the Vue Star Wars Info application.</h1>

        <loading-anim :show="loading" />
        <ul>
            <li v-for="film in films" :key="film.title" @click="handleClick(film.id)">
                {{ film.title }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
ul {
    list-style-type: none;
}
</style>

<script>
import {axiosGet as get} from "@/utils/global";
import {mapActions, mapGetters} from 'vuex';
import ResourceList from "@/components/ResourceList.vue"; 
import LoadingAnim from "@/components/LoadingAnim.vue";
import Router from "@/router";

export default {
    components: {
        'resource-list': ResourceList,
        'loading-anim': LoadingAnim,
    },
    data: function() {
        return {
            films: [],
            loading: false,
        };
    },
    computed: {
        ...mapGetters([
            'getResource',
        ]),
    },
    mounted: async function() {
        // TODO
        // fetch from server cache first since this is the largest API call

        this.loading = true;
        await this.fetchResource({type: 'films'});
        this.films = this.getResource('films');
        this.loading = false;
    },
    methods: {
        ...mapActions([
            'fetchResource',
        ]),
        handleClick(id) {
            Router.push(`/details/films/${id}`);
        },
    },
}
</script>
