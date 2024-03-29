<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { SocialMedia, defaultSocialMediaSearchFilter, SocialMediaSearchFilter } from '/@src/models/CRM/SocialMedia/socialMedia';
import { addSocialMediasToCustomer } from '/@src/services/CRM/Customer/customerService';
import { getSocialMediasList } from '/@src/services/CRM/SocialMedia/socialMediaService';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { BaseConsts } from '/@src/utils/consts/base';
import sleep from "/@src/utils/sleep"

const {t} = useI18n()
const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const customerId = ref<number>(0)
// @ts-ignore
customerId.value = route.params?.id

viewWrapper.setPageTitle(t('customer.form.step_3_title'))
const head = useHead({
    title: t('customer.form.page_title'),
})
const notif = useNotyf() as Notyf
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 4,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            customerForm.reset()
            router.push({
                path: `/customer/${customerId.value}`,
            })
        }

    },
    skipStepFn: async () => {
        customerForm.reset()

        router.push({
            path: `/customer/${customerId.value}`,
        })
    }

})
const pageTitle = t('customer.form.step_3_subtitle')
const socialMediasList = ref<SocialMedia[]>([])
interface SocialMediaChecked {
    socialMedia: SocialMedia
    checked: boolean
    url: string
}
const socialMediaChecked = ref<SocialMediaChecked[]>([])
onMounted(async () => {

    let socialMediaSearchFilter: SocialMediaSearchFilter = defaultSocialMediaSearchFilter
    socialMediaSearchFilter.status = BaseConsts.ACTIVE
    const { socialMedias } = await getSocialMediasList(socialMediaSearchFilter)
    socialMediasList.value = socialMedias
    
    for (let index = 0; index < socialMediasList.value.length; index++) {
        socialMediaChecked.value.push({ socialMedia: socialMediasList.value[index], checked: false, url: '' })

    }
})



const onSubmitAdd = async () => {

    for (let i = 0; i < socialMediaChecked.value.length; i++) {
        if (socialMediaChecked.value[i].checked == true) {
            customerForm.customerSocialMediaForm.push({ social_media_id: socialMediaChecked.value[i].socialMedia.id as number, url: socialMediaChecked.value[i].url })

        }
        else {
        }

    }
    customerForm.data.is_completed = true
    const customer = await addSocialMediasToCustomer(customerId.value, customerForm.customerSocialMediaForm)

    if (customer.success) {
        // @ts-ignore
        await sleep(200);

        notif.success(t('toast.success.add'))

        return true
    }
    else {
        // @ts-ignore
        await sleep(200);

        notif.error(customer.message)

    }

}




</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="onSubmitAdd()">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">

                                <VField>

                                    <VControl v-for="socialMedia in socialMediaChecked" raw nogrow subcontrol>
                                        <VCheckbox :label="socialMedia.socialMedia.name"
                                            :name="socialMedia.socialMedia.id" color="primary"
                                            :key="socialMedia.socialMedia.id" v-model="socialMedia.checked" />
                                        <VIcon :icon="socialMedia.socialMedia.icon"
                                            class="has-text-primary is-size-5" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField v-for="socialMedia in socialMediaChecked" :id="socialMedia.socialMedia.name">

                                    <VLabel class="required" v-if="socialMedia.checked">
                                    {{t('customer.form.social_media_url', {social_media : socialMedia.socialMedia.name })}}
                                    </VLabel>
                                    <VControl v-if="socialMedia.checked" icon="feather:chevrons-right">
                                        <VInput type="text" placeholder="" autocomplete="" v-model="socialMedia.url"
                                            :key="socialMedia.socialMedia.id" />

                                    </VControl>

                                </VField>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </form>



    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.required::after {
    content: " *";
    color: var(--danger);
}


.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}
</style>
