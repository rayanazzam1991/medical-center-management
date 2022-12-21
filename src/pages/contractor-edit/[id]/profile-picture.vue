<script setup  lang="ts">import { useHead } from '@vueuse/head';
import { addPersonalId, deletePersonalId, getPersonalId } from '/@src/services/Contractor/contractorService';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultContractorPersonalId } from '/@src/models/Contractor/contractor';
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contractor Profile Picture')
const head = useHead({
    title: 'Contractor',
})
const notif = useNotyf()
const contractorForm = useContractorForm()
const route = useRoute()
const router = useRouter()
const contractorId = ref()
const currentPersonalId = ref(defaultContractorPersonalId)
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
            var isValid = await onSubmitEdit()
            if (isValid) {

                router.push({
                    path: `/contractor-edit/${contractorId.value}/services`
                })
            }

        }

    },
    skipStepFn: async () => {

        router.push({
            path: `/contractor-edit/${contractorId.value}/services`
        })
    }

})

const fileError = ref('')
const pageTitle = 'Step 2: Contractor Profile Picture'
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

const onSubmitEdit = async () => {
    if (currentPersonalId.value.id != undefined)
        await deletePersonalId(currentPersonalId.value.id)
    let formData = new FormData();
    if (personal_id.value != undefined)
        formData.append('images[]', personal_id.value);

    const { success, message } = await addPersonalId(contractorId.value, formData)

    if (success) {
        // @ts-ignore
        notif.success(`${contractorForm.userForm.first_name} ${contractorForm.userForm.last_name} Personal ID was edited successfully`)

        return true
    }
    else {
        // @ts-ignore

        notif.error(message)

    }

}
onMounted(async () => {
    await getCurrentPersonalId()
})
const getCurrentPersonalId = async () => {
    var personalId = await getPersonalId(contractorId.value)
    console
    if (personalId.media.length > 0)
        currentPersonalId.value = personalId.media[personalId.media.length - 1]
}
const onRemoveFile = (error: any, fileInfo: any) => {
    fileError.value = ''
    if (error) {
        // @ts-ignore
        notif.error(error)
        return
    }


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
            <div id="wizard-step-1" class="inner-wrapper is-active">
                <div class="step-content">
                    <div class="step-title">
                        <h2 class="dark-inverted">Current Personal ID :</h2>
                    </div>

                    <div class="project-info">
                        <div class="project-info-head">
                            <div class="project-avatar-upload">
                                <VAvatar :picture="currentPersonalId?.relative_path" size="xl" />


                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </form>



    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/Styles/profilePictureWizard.scss';

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
 