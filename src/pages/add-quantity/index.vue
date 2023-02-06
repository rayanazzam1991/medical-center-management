<script setup  lang="ts">
import { useHead } from '@vueuse/head';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { addQuantity, defaultAddQuantityItem, ItemHsitoryConsts } from '../../models/Warehouse/ItemHistory/inventoryItemHistory';
import { addQuantityService, addItemHistoryFile } from '../../services/Warehouse/ItemHistory/inventoryItemHistoryService';
import { useItemHistoryForm } from '/@src/stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { addQuantityvalidationSchema } from '/@src/rules/Warehouse/ItemHistory/addQuantityValidation';
import sleep from '/@src/utils/sleep';
import { BaseConsts } from '/@src/utils/consts/base';
import { Category, CategorySearchFilter, defaultCategory, defaultCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';
import { defaultItemSearchFilter, Item, ItemSearchFilter } from '/@src/models/Warehouse/Item/item';
import { getItemsList } from '/@src/services/Warehouse/Item/itemService';
import { Media } from '/@src/models/Others/Media/media';
import { error } from 'node:console';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
const itemStore = useItem()
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('add_quantity.form.title'))
const head = useHead({
    title: t('add_quantity.form.title'),
})
const itemHistoryForm = useItemHistoryForm()
itemHistoryForm.setStep({
    number: 1,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            router.push({
                path: `/item/${currentaddQuantity.value.item_id}`,
            })
        }
    },

})
const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const pageTitle = t('add_quantity.form.title')
const phoneCheck = ref<string>('false')
const currentaddQuantity = ref(defaultAddQuantityItem)
const selectedCategoryId = ref()
const selectedSubCategoryId = ref()
const subcategoeisList = ref<Category[]>([])
const allCategoriesList = ref<Category[]>([])
const itemHistoryFiles = ref<Array<Media>>([])
const filesToUpload = ref<File>()
const itemHistoryId = ref(0)
const allItemsList = ref<Item[]>([])
const itemsList = ref<Item[]>([])

const getCurrentAddQuantity = async () => {
    currentaddQuantity.value = itemHistoryForm.data
}
const mainCategoriesList = ref<Category[]>([])
onMounted(async () => {
    let categorySearchFilter = {} as CategorySearchFilter
    categorySearchFilter.status = BaseConsts.ACTIVE
    categorySearchFilter.per_page = 500
    const allCategories = await getFilterCategoriesList(categorySearchFilter)
    allCategoriesList.value = allCategories.categories
    mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
    await getCurrentAddQuantity();
})

const getSubCategoryByCategroy = () => {
    let categoriesFilter = {} as CategorySearchFilter
    categoriesFilter.status = BaseConsts.ACTIVE
    categoriesFilter.parent_id = selectedCategoryId.value
    const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
    subcategoeisList.value = SubCategory
    itemsList.value = []
     selectedSubCategoryId.value= undefined
    currentaddQuantity.value.item_id=0
}
const getItemBySubCategroy = async () => {
    let itemSearchFilter = {} as ItemSearchFilter
    itemSearchFilter.status = BaseConsts.ACTIVE
    itemSearchFilter.per_page = 500
    const { items } = await getItemsList(itemSearchFilter)
    allItemsList.value = items
    let ItemFilter = {} as ItemSearchFilter
    ItemFilter.category_id = selectedSubCategoryId.value
    const Item = allItemsList.value.filter((item) => item.category.id == ItemFilter.category_id)
    itemsList.value = Item
}
onMounted(() => {
    getCurrentAddQuantity()
})

const validationSchema = addQuantityvalidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        sub_category_id:undefined,
        item_id: undefined,
        item_quantity: "",
        add_item_cost: "",
        note: "",
        invoice_number: "",
        status: 1,
    },
})
const onAddFile = async (event: any) => {
    const _file = event.target.files[0] as File
    let _message = ''
    if (_file) {

        if (_file.type != 'image/jpeg' && _file.type != 'image/png' && _file.type != 'image/webp') {
            _message = t('toast.file.type')
            await sleep(500);
            notif.error(_message)

        } else if (_file.size > (2 * 1024 * 1024)) {
            _message = t('toast.file.size')
            await sleep(500);
            notif.error(_message)

        } else {

            filesToUpload.value = _file
        }
    }
}

const onSubmitAdd = handleSubmit(async (values) => {
    let addQuantityForm = currentaddQuantity.value
    const { addQuantity, success, message } = await addQuantityService(addQuantityForm)
    if (success) {
        let formData = new FormData();
        if (filesToUpload.value != undefined)
            formData.append('images[]', filesToUpload.value);
        const { success, message, media } = await addItemHistoryFile(addQuantity.id, formData)
        if (success) {
            // @ts-ignore
            await sleep(500);
            media[0].file_name = media[0].relative_path
            media[0].relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path
            itemHistoryFiles.value.push(media[0])
            filesToUpload.value = undefined
        }
        // @ts-ignore
        notif.dismissAll();
        // @ts-ignore
        await sleep(500)
        notif.success(t('toast.success.add'));

        router.push({ path: `/item/` });
    }
    else {
        await sleep(500);
        notif.error(message)
    }
})


</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField >
                                    <VLabel class="required">{{ t('add_quantity.form.level_1')}}</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getSubCategoryByCategroy" v-if="currentaddQuantity"
                                                v-model="selectedCategoryId">
                                                <VOption value="">{{ t('add_quantity.form.select_level_1')}}</VOption>
                                                <VOption v-for="category in mainCategoriesList" :key="category.id"
                                                    :value="category.id">{{ category.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="sub_category_id">
                                    <VLabel class="required">
                                        {{ t('add_quantity.form.level_2')}}
                                    </VLabel>
                                    <VControl>
                                        <VSelect :disabled="subcategoeisList.length <= 0" @change="getItemBySubCategroy"
                                            v-if="currentaddQuantity" v-model="selectedSubCategoryId">
                                            <VOption>{{ t('add_quantity.form.select_level_2')}}</VOption>
                                            <VOption v-for="subCategory in subcategoeisList" :key="subCategory.id"
                                                :value="subCategory.id">
                                                {{ subCategory.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="sub_category_id" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="item_id">
                                    <VLabel class="required" style="position:relative">
                                       {{t('add_quantity.form.item')}}
                                        <div v-if="itemStore.loading"
                                            class="loader is-loading m-r-15 m-b-05-rem w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <!-- <div class="select"> -->
                                            <VSelect :disabled="itemsList.length <= 0" v-if="currentaddQuantity"
                                                v-model="currentaddQuantity.item_id">
                                                <VOption value="">  {{t('add_quantity.form.select_item')}}</VOption>
                                                <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                                    {{ item.name }}
                                                </VOption>
                                            </VSelect>
                                            <ErrorMessage class="help is-danger" name="item_id" />

                                        <!-- </div> -->
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="item_quantity">
                                    <VLabel class="required"> {{t('add_quantity.form.item_quantity')}}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentaddQuantity.item_quantity" type="number" placeholder=""
                                            autocomplete="given-item_quantity" />
                                        <ErrorMessage class="help is-danger" name="item_quantity" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="add_item_cost">
                                    <VLabel class="required">{{t('add_quantity.form.item_cost')}}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentaddQuantity.add_item_cost" type="number" placeholder=""
                                            autocomplete="given-add_item_cost" />
                                        <ErrorMessage class="help is-danger" name="add_item_cost" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="status" v-slot="{ field }">
                                    <VLabel class="required">{{t('add_quantity.form.status')}}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentaddQuantity.status" :value="ItemHsitoryConsts.ACTIVE"
                                            :label="ItemHsitoryConsts.showStatusName(1)" name="status"
                                            color="success" />
                                        <VRadio v-model="currentaddQuantity.status" :value="ItemHsitoryConsts.INACTIVE"
                                            :label="ItemHsitoryConsts.showStatusName(0)" name="status"
                                            color="danger" />
                                        <ErrorMessage name="status" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                        <!--Fieldset-->
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel class="optinal">{{t('add_quantity.form.item_note')}}</VLabel>
                                    <VControl>
                                        <VTextarea v-model="currentaddQuantity.note" />
                                        <ErrorMessage class="help is-danger" name="note" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>

                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="invoice_number">
                                    <VLabel class="optinal">{{t('add_quantity.form.invoice_number')}}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentaddQuantity.invoice_number" type="text" placeholder=""
                                            autocomplete="given-invoice_number" />
                                        <ErrorMessage class="help is-danger" name="invoice_number" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField>
                                    <VLabel class="optinal">{{t('add_quantity.form.invoice_image')}}</VLabel>
                                    <VControl>
                                        <div class="file has-name">
                                            <label class="file-label">
                                                <input class="file-input" type="file" v-on:change="onAddFile" />
                                                <span class="file-cta">
                                                    <span class="file-icon">
                                                        <i class="fas fa-cloud-upload-alt"></i>
                                                    </span>
                                                    <span class="file-label"> {{ t('images.image_name_placeholder')}} </span>
                                                </span>
                                                <span class="file-name light-text">
                                                    {{ filesToUpload?.name ?? t('images.image_select_file') }}
                                                </span>
                                            </label>
                                        </div>
                                    </VControl>
                                </VField>
                                <h6 class="font ml-2 mt-2 help">{{t('images.accepted_file')}}
                                </h6>
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

.font {
    font-size: xx-small;
}

.Vi {
    width: 28.5em;
}

.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
    padding-bottom: 72px;

}


.lab {
    margin-left: .77em;
    margin-bottom: .27em;
    display: block;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 45%;
}
</style>
