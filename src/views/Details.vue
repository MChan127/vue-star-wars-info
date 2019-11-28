<template>
    <div class="details">
        <h1>{{ this.fields.name ? this.fields.name : this.fields.title }}</h1>

        <loading-anim :show="loading" />
        <div class="details__info">
            <div class="fields">
                <ul>
                    <li v-for="(value, field) in fields" :key="'resource_field_' + field">
                        <span>{{ field }}: {{ value }}</span>
                    </li>
                </ul>
            </div>
            <div class="lists">
                <resource-list 
                    v-for="(paths, type) in lists" 
                    :key="'resource_list_' + type"
                    :title="type"
                    :type="type"
                    :resourcePaths="paths"
                />
            </div>
        </div>

        <div>
            <router-link to="/">Back to Films</router-link>
        </div>
    </div>
</template>

<style scoped>
.details__info {
    display: flex;
}
.lists {
    width: 50%;

    @media (max-width: 767px) {
        width: 100%;
    }
}
.fields {
    width: 50%;

    @media (max-width: 767px) {
        width: 100%;
    }
}
.fields ul {
    list-style-type: none;
    text-align: left;
}
</style>

<script>
import {mapGetters, mapActions} from "vuex";
import ResourceList from "@/components/ResourceList";
import LoadingAnim from "@/components/LoadingAnim";

export default {
    components: {
        'resource-list': ResourceList,
        'loading-anim': LoadingAnim,
    },
    data: function() {
        return {
            type: this.$route.params.type,
            id: this.$route.params.id,
            fields: {},
            lists: {},
            loading: false,
        };
    },
    computed: {
        ...mapGetters([
            'getResource',
        ]),
    },
    methods: {
        ...mapActions([
            'fetchResource',
        ]),
    },
    mounted: async function() {
        // only display details pages for specific items, not root
        if (!this.id) {
            this.$router.push('/');
            return;
        }

        this.loading = true;
        await this.fetchResource({type: this.type, id: this.id});
        let fetchedResource = this.getResource(this.type, this.id);
        this.fields = Object.assign({}, fetchedResource);
        this.lists = Object.assign({}, this.fields.lists);
        delete this.fields.lists;
        this.loading = false;
    },
};
</script>