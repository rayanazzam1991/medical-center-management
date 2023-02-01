<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { getRoom } from "/@src/services/Others/Room/roomSevice"
import { defaultRoom } from "/@src/models/Others/Room/room"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { RoomConsts } from "/@src/models/Others/Room/room"
import { useRoom } from "/@src/stores/Others/Room/roomStore"
import sleep from "/@src/utils/sleep"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('room.details.title'))
const head = useHead({
    title: t('room.details.title'),
})


const roomStore = useRoom()
const roomId = ref(0)
// @ts-ignore
roomId.value = route.params?.id as number ?? 0
const currentRoom = ref(defaultRoom)
await sleep(500)
const getCurrentRoom = async () => {
    const { room } = await getRoom(roomId.value)
    if (room != undefined)
        currentRoom.value = room
    pageTitle.value = viewWrapper.pageTitle + '# ' + currentRoom.value.number

}
onMounted(async () => {
    await getCurrentRoom()
})

const toEdit = () => {
    router.push({ path: `/room/${roomId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/room'" @onSubmit="toEdit"
        :isLoading="roomStore?.loading" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom"> {{t('room.details.number')}}:</h4>
                            <span>{{ currentRoom.number }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom"> {{t('room.details.floor')}}:</h4>
                            <span>{{ currentRoom.floor }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom"> {{t('room.details.department')}}:</h4>
                            <span>{{ currentRoom.department?.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom"> {{t('room.details.status')}}:</h4>
                            <span>
                                <VTag :color="currentRoom.status === RoomConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ RoomConsts.showStatusName(currentRoom.status) }}</VTag>
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
