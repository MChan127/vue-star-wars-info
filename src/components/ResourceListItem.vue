<template>
    <div class="resource-list-item" 
        v-if="resource !== null">
        <span class="resource-list-item__label" @click="handleClick(resource.id)">
            {{ resource.name ? resource.name : resource.title }}
        </span>
    </div>
</template>

<script>
import {getDetailPageName} from "@/utils/global";
import {RESOURCE_TYPES} from "@/utils/constants";
import Router from "@/router";

export default {
    props: {
        // {data, type, id}
        resource: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    methods: {
        /**
         * Upon click, the user is taken laterally to other detail pages with
         * their own links to other resources
         */
        handleClick(id) {
            const detailPage = RESOURCE_TYPES[this.type].plural.toLowerCase();
            const newRoute = `/details/${detailPage}/${id}`;
            if (newRoute === window.location.pathname) {
                return;
            }
            Router.push(newRoute);
        },
    },
};
</script>