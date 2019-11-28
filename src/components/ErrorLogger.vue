<template>
    <div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            errors: 'getErrors',
        }),
    },
    watch: {
        // errors propagate here from `addError` vuex action
        // can log these errors as they come, or render them inside this component
        errors: function(newVal, oldVal) {
            console.log('errors', newVal, oldVal);
        },
    },
};
</script>