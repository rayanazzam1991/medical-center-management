<script lang="ts">
import { useI18n } from "vue-i18n"
export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        return { t }
    },


})




</script>

<template>
    <form class="form-layout">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-5 mx-2 ">
                        <div class="columns is-flex is-align-items-center title">
                            {{ t('role.table.title') }}
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-weight: 600;
    font-size: 1.2rem;
}
</style>
