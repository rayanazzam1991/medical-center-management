<script setup lang="ts">
import { usePanels } from '/@src/stores/panels'
import { useHead } from '@vueuse/head'
import { defaultPosition } from '/@src/models/Others/Position/position'
import { getPosition } from '/@src/services/Others/Position/positionService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { PositionConsts } from '/@src/models/Others/Position/position'
import { usePosition } from '/@src/stores/Others/Position/positionStore'
import sleep from '/@src/utils/sleep'
import { useI18n } from 'vue-i18n'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('position.details.title'))
const head = useHead({
    title: t('position.details.title'),
})


const positionStore = usePosition()
const positionId = ref(0)
// @ts-ignore
positionId.value = route.params?.id as number ?? 0
const currentPosition = ref(defaultPosition)
const getCurrentPosition = async () => {
    const { position } = await getPosition(positionId.value)

    if (position != undefined)
        currentPosition.value = position
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentPosition.value.name

}
onMounted(async () => {
    await getCurrentPosition()
})

const toEdit = () => {
    router.push({ path: `/position/${positionId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/position'" @onSubmit="toEdit"
        :permission="Permissions.POSITION_EDIT" :isLoading="positionStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ t('position.details.name') }}:</h4>
                            <span>{{ currentPosition.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom"> {{ t('position.details.description') }}:</h4>
                            <span>{{ currentPosition?.description ?? t('place_holder.none') }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom"> {{ t('position.details.status') }}:</h4>
                            <span>
                                <VTag :color="currentPosition.status === PositionConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ PositionConsts.showStatusName(currentPosition.status) }}</VTag>
                            </span>
                        </div>
                    </div>
                </div>
                <!--Fieldset-->
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/detailsPage.scss';
</style>
