<script setup  lang="ts">import { useHead } from '@vueuse/head';
import { useNotyf } from '/@src/composable/useNotyf';
import { addPersonalId } from '/@src/services/Contractor/contractorService';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contractor Personal ID')
const head = useHead({
    title: 'Contractor',
})
const notif = useNotyf()
const contractorForm = useContractorForm()
const route = useRoute()
const router = useRouter()
const contractorId = ref()
const personal_id = ref()

// @ts-ignore

contractorId.value = route.params?.id
contractorForm.setStep({
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
                    path: `/contractor-add/${contractorId.value}/services`
                })
            }

        }

    },
    skipStepFn: async () => {
        router.push({
            path: `/contractor-add/${contractorId.value}/services`
        })
    }

})

const fileError = ref('')
const pageTitle = 'Step 2: Contractor Personal ID'
const onSubmitAdd = async () => {

    let formData = new FormData();
    if (personal_id.value != undefined)
        formData.append('images[]', personal_id.value);

    const media = await addPersonalId(contractorId.value, formData)

    if (media.success) {
        // @ts-ignore
        notif.success(`${contractorForm.userForm.first_name} ${contractorForm.userForm.last_name} Personal ID was added successfully`)

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
        personal_id.value = _file
    }
}

const onRemoveFile = (error: any, fileInfo: any) => {
    fileError.value = ''
    if (error) {
        // @ts-ignore
        notif.error(error)
        return
    }


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

                                        <VFilePond size="xl" class="profile-filepond" name="profile_filepond"
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
