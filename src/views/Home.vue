<template>
    <div class="home">
        <h1>Welcome to the Vue Star Wars Info application.</h1>

        <div class="search-films" v-if="!loading">
            <span>Search Title or Opening Crawl: </span> 
            <input type="text" v-model="search" />
        </div>
        <loading-anim :show="loading" />
        <ul>
            <li v-for="film in filteredFilms" :key="film.title" @click="handleClick(film.id)">
                {{ film.title }}
            </li>
        </ul>
    </div>
</template>

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
            films: {},
            filteredFilms: {},
            loading: false,
            search: '',
        };
    },
    computed: {
        ...mapGetters([
            'getResource',
        ]),
    },
    watch: {
        films: function() {
            this.updateSearchFilter();
        },
        search: function() {
            this.updateSearchFilter();
        },
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
        updateSearchFilter() {
            console.log('search', this.search, this.films);
            if (!this.films || typeof this.films !== 'object' ||
                !this.search || this.search.trim().length < 1) {
                this.filteredFilms = this.films;
                return;
            }
            const filtered = {};
            for (let id in this.films) {
                let item = this.films[id];
                if ((!item.title && !item.opening_crawl) ||
                    item.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
                    item.opening_crawl.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
                    filtered[id] = item;
                }   
            }
            console.log(filtered);
            this.filteredFilms = filtered;
        },
    },
}
</script>
