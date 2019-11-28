<template>
    <div class="home">
        <h1>Welcome to the Vue Star Wars Info application.</h1>

        <div class="loading" v-if="loading">
            <!-- TODO loading animation -->
        </div>
        <ResourceList 
            title="Films"
            v-if="!loading"
            :forceShow="true"
        />
    </div>
</template>

<script>
import {axiosGet as get} from "@/utils/global";
import {mapActions, mapGetters} from 'vuex';

export default {
    data: function() {
        return {
            loading: false,
        };
    },
    computed: {
        ...mapGetters({
            films: getResource('films'),
        }),
    },
    mounted: async function() {
        // TODO
        // fetch from server cache first since this is the largest API call

        if (initialData === null) {
            this.loading = true;

            this.loading = true;
            await this.fetchResources();
            this.loading = false;
        }
    },
    methods: {
        ... mapActions([
            'fetchResources',
        ]),
    },
}
</script>
