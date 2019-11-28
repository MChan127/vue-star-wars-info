<template>
    <div class="resource-list__component">
        <h3 class="resource-list__title" @click="handleClick">
            &plus; {{ 'List of ' + title }}
        </h3>

        <div class="resource-list__container"
            :class="{hidden}">
            <div class="loading" v-if="loading && resources === null">
                <!-- TODO loading animation -->
            </div>
            <ul class="resource-list__list">
                <li v-for="resource in resources" 
                    :key={title + '_' + (resource.name ? resource.name : resource.title)}
                >
                    <ResourceListItem :resource="resource" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {axiosGet as get} from "@/utils/global";

export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        resourcePaths: {
            type: Array,
            required: true,
        },
        forceShow: {
            type: Boolean,
            required: false,
        },
    },
    data: function() {
        // resources are hidden at first until the list title is clicked
        return {
            resources: null,
            loading: false,
            // only used by initial list of films, since we want that to show always
            hidden: !this.forceShow,
        };
    },
    mounted: function() {

    },
    methods: {
        handleClick() {
            if (this.resources === null) {
                this.loading = true;
                this.fetchResources();
            }
            if (!this.forceShow) {
                this.hidden = !this.hidden;
            }
        },
        async fetchResources() {
            const fetched = [];
            for (let i = 0; i < this.resourcePaths.length; i++) {
                let path = this.resourcePaths[i];

                // try to get the existing resource from store
                let data = this.$store.getters.getResource(resourcePath);

                // if data empty in store
                if (!data) {
                    try {
                        data = await get(path, {promisify: true});
                    } catch (e) {
                        this.$store.errors.push("Error fetching for ${resourcePath}, ${e}");
                    }
                }

                // finally, push to the resource array
                // bundled with the type and id to use for directing to the "Detail" page
                if (data !== null) {
                    let splitPath = path.split('/');
                    fetched.push({
                        data,
                        type: splitPath[0], 
                        id: splitPath[1],
                    });
                }
            }
            this.resources = fetched;

            this.loading = false;
        },
    },
};
</script>