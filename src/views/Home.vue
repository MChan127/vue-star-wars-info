<template>
    <div class="home">
        <h1>Welcome to the Vue Star Wars Info application.</h1>

        <div class="loading" v-if="loading">
            <!-- TODO loading animation -->
        </div>
        <!-- <resource-list 
            title="Films"
            v-if="!loading"
            :forceShow="true"
            :resourcePaths="films"
        /> -->
        <div v-for="film in films" :key="film.title">
            {{ film.title }}
        </div>
    </div>
</template>

<script>
import {axiosGet as get} from "@/utils/global";
import {mapActions, mapGetters} from 'vuex';
import ResourceList from "@/components/ResourceList.vue"; 

export default {
    components: {
        'resource-list': ResourceList,
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

        if (this.films === null || Object.entries(this.films).length < 1) {
            this.loading = true;
            await this.fetchResource({type: 'films'});
            this.films = this.getResource('films');
            this.loading = false;
        }
    },
    methods: {
        ...mapActions([
            'fetchResource',
        ]),
    },
}
</script>
