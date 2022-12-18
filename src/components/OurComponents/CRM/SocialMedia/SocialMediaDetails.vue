<script setup lang="ts">import { useHead } from '@vueuse/head';
import { defaultSocialMedia } from '/@src/models/CRM/SocialMedia/socialMedia';
import { getSocialMedia } from '/@src/services/CRM/SocialMedia/socialMediaService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { SocialMediaConsts } from '/@src/models/CRM/SocialMedia/socialMedia';

const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Social Media')
const head = useHead({
    title: 'Social Media',
})



const socialMediaId = ref(0)
// @ts-ignore
socialMediaId.value = route.params?.id as number ?? 0
const currentSocialMedia = ref(defaultSocialMedia)
const getCurrentSocialMedia = async () => {
    const { socialMedia } = await getSocialMedia(socialMediaId.value)
    if (socialMedia != undefined)
        currentSocialMedia.value = socialMedia
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentSocialMedia.value.name

}
onMounted(async () => {
    await getCurrentSocialMedia()
})

const toEdit = () => {
    router.push({ path: `/social-media/${socialMediaId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/social-media'" @onSubmit="toEdit" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Name:</h4>
                            <span>{{ currentSocialMedia.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Icon:</h4>
                            <VIcon :icon="currentSocialMedia.icon" />
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Status:</h4>
                            <span>
                                <VTag
                                    :color="currentSocialMedia.status === SocialMediaConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ SocialMediaConsts.showStatusName(currentSocialMedia.status) }}</VTag>
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
