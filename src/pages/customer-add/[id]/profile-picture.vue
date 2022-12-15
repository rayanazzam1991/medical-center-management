
<script setup  lang="ts">
import { useHead } from "@vueuse/head"
import { useNotyf } from "/@src/composable/useNotyf"
import { addProfilePicture } from "/@src/services/CRM/Customer/customerService"
import { useCustomerForm } from "/@src/stores/CRM/Customer/customerFormSteps"
import { useViewWrapper } from "/@src/stores/viewWrapper"


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Profile Picture')
const head = useHead({
    title: 'Customer',
})
const notif = useNotyf()
const customerForm = useCustomerForm()
const route = useRoute()
const router = useRouter()
const customerId = ref()
const profile_picture = ref()
// @ts-ignore

customerId.value = route.params?.id
customerForm.setStep({
    number: 2,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        if (fileError.value != '') {
            // @ts-ignore
            notif.error(fileError.value)
        }
        else {
            var isValid = await onSubmitAdd()
            if (isValid) {
                router.push({
                    path: `/customer-add/${customerId.value}/medical-info`
                })
            }



        }

    },
    skipStepFn: async () => {

        router.push({
            path: `/customer-add/${customerId.value}/medical-info`
        })
    }

})

const fileError = ref('')
const pageTitle = 'Step 3: Customer Profile Picture'
const onSubmitAdd = async () => {

    let formData = new FormData();
    if (profile_picture.value != undefined)
        formData.append('images[]', profile_picture.value);

    const media = await addProfilePicture(customerId.value, formData)

    if (media.success) {
        // @ts-ignore
        notif.success(`${customerForm.userForm.first_name} ${customerForm.userForm.last_name} Profile Picture was added successfully`)

        return true
    }
    else {
        // @ts-ignore

        notif.error(media.success)

    }

}
const onAddFile = (error: any, fileInfo: any) => {
    if (error) {
        // @ts-ignore
        notif.error(`${error.main}: ${error.sub}`)
        console.error(error)
        fileError.value = error.main + ':' + error.sub
        return

    }

    const _file = fileInfo.file as File
    if (_file) {
        profile_picture.value = _file
    }
}

const onRemoveFile = (error: any, fileInfo: any) => {
    fileError.value = ''
    if (error) {
        // @ts-ignore
        notif.error(error)
        fileError.value = error
        return
    }

    console.log(fileInfo)

    // wizard.data.logo = null
}






</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="">
            <div id="wizard-step-1" class="inner-wrapper is-active">
                <div class="step-content">
                    <div class="step-title">
                        <h2 class="dark-inverted">{{ pageTitle }}</h2>
                    </div>

                    <div class="project-info">
                        <div class="project-info-head">
                            <div class="project-avatar-upload">
                                <VField>
                                    <VControl>

                                        <VFilePond size="large" class="profile-filepond" name="profile_filepond"
                                            :chunk-retry-delays="[500, 1000, 3000]"
                                            label-idle="<i class='lnil lnil-cloud-upload'></i>"
                                            :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                                            :image-preview-height="140" :image-resize-target-width="140"
                                            :image-resize-target-height="140" image-crop-aspect-ratio="1:1"
                                            style-panel-layout="compact circle"
                                            style-load-indicator-position="center bottom"
                                            style-progress-indicator-position="right bottom"
                                            style-button-remove-item-position="left bottom"
                                            style-button-process-item-position="right bottom" @addfile="onAddFile"
                                            @removefile="onRemoveFile" />

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

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}
</style>
