<script lang="ts">import { useI18n } from 'vue-i18n'
import { boolean } from 'zod'
import { defaultPagination } from '/@src/utils/response'





export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        button_name: {
            type: String,
            default: '',
        },
        enable_button:{
            type: Boolean,
            defualt:false
        }
    },

    emits: ['onSubmit'],
    setup(props, context) {
        const { t } = useI18n()
        const title = ref('')
        title.value = props.title
        let submited = false
        const onSubmit = () => {
        context.emit('onSubmit', submited)
        }
        

        return { t, title ,onSubmit}
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="left">
                            <h3>{{ title }}</h3>
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl>
                                <VButton @click="onSubmit"  color="primary">
                                    {{ button_name }}
                                </VButton>
                            </VControl>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
