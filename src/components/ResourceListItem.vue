<template>
    <div class="resource-list-item" 
        v-if="resource !== null"
        @click="handleClick">
        <span class="resource-list-item__label">
            {{ resource.name ? resource.name : resource.title }}
        </span>
    </div>
</template>

<script>
import {getDetailPageName} from "@/utils/global";
import {RESOURCE_TYPES} from "@/utils/constants";

export default {
    props: {
        // {data, type, id}
        resource: {
            type: Object,
            required: true,
        },
    },
    method: {
        // upon click, take user to "Detail" page for this type of item
        const detailPage = RESOURCE_TYPES[this.type].singular;
        handleClick() {
            Router.push("${detailPage}/${this.id}");
        },
    }
};
</script>