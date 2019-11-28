<template>
    <div class="resource-list__component">
        <h3 class="resource-list__title" @click="handleClick">
            &plus; {{ 'List of ' + title }}
        </h3>

        <loading-anim :show="loading && resources === null" />
        <div class="resource-list__container"
            :class="{hidden}">
            <ul class="resource-list__list">
                <li v-for="resource in resources" 
                    :key="title + '_' + (resource.name ? resource.name : resource.title)"
                    @click="handleClickItem"
                >
                    <resource-list-item :resource="resource" :type="type" />
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.resource-list__container.hidden {
    display: none;
}
.resource-list__list {
    list-style-type: none;
}
</style>

<script>
import {axiosGet as get} from "@/utils/global";
import {mapGetters, mapActions, mapMutations} from "vuex";
import ResourceListItem from "@/components/ResourceListItem.vue";
import LoadingAnim from "@/components/LoadingAnim";

export default {
    components: {
        'resource-list-item': ResourceListItem,
        'loading-anim': LoadingAnim,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        type: {
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
    computed: {
        ...mapGetters([
            'getResource',
        ]),
    },
    methods: {
        ...mapActions([
            'fetchResource',
            'addError',
        ]),
        ...mapMutations([
            'addError',
        ]),
        async handleClick() {
            if (this.resources === null) {
                const that = this;
                this.loading = true;

                // this is potentially a ton of api calls
                // therefore we run them all asynchronously and
                // chain the getter to each request as well
                let promises = [];
                for (let path of this.resourcePaths) {
                    let parts = path.split('/');
                    if (parts.length != 3) {
                        continue;
                    }
                    let id = parts[1],
                        type = parts[0];
                    promises.push(((type, id) => {
                        return new Promise((fulfill, reject) => {
                            that.fetchResource({type, id}).then(() => {
                                fulfill(that.getResource(type, id));
                            }, err => {
                                that.addError(err);
                                reject();
                            });
                        });
                    })(type, id));
                }
                // finally assign to state once everything has loaded
                this.resources = await Promise.all(promises);
                this.loading = false;
            }
            if (!this.forceShow) {
                this.hidden = !this.hidden;
            }
        },
        async handleClickItem() {
            
        },
    },
};
</script>