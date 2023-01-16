<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { defaultCategory, Category, CategoryConsts, defaultCreateUpdateCategory, defaultMainCategorySearchFilter, CategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getCategory, addCategory, editCategory, getCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { categoryvalidationSchema } from '/@src/rules/Warehouse/Category/categoryAddValidation';
import sleep from "/@src/utils/sleep";
import { useCategory } from '/@src/stores/Warehouse/Category/CategoryStore';
import { BaseConsts } from '/@src/utils/consts/base';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const {t} = useI18n()
        const viewWrapper = useViewWrapper();

        viewWrapper.setPageTitle(t('category.form.page_title'));
        const head = useHead({
            title: t('category.form.page_title'),
        });
        const categoryStore = useCategory()
        const notif = useNotyf() as Notyf
        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('category.form.form_header' , {type : formTypeName})
        const backRoute = '/category'
        const currentCategory = ref(defaultCategory)
        const currentCreateUpdateCategory = ref(defaultCreateUpdateCategory)
        const categoryId = ref(0);
        const isCategory = ref(false)
        const keyIncrement = ref(0)
        categoryId.value = route.params?.id as number ?? 0;
        const getCurrentCategory = async () => {
            if (categoryId.value === 0) {
                currentCategory.value.name = ''
                currentCategory.value.parent = defaultCategory
                currentCategory.value.parent.id = undefined
                currentCategory.value.status = 1
                return
            }
            else {
                const { category } = await getCategory(categoryId.value);
                currentCategory.value = category != undefined ? category : defaultCategory;
                if (currentCategory.value.parent != undefined) {
                    isCategory.value = true
                    keyIncrement.value++
                    let mainCategorySearchFilter = {} as CategorySearchFilter
                    mainCategorySearchFilter.per_page = 500
                    mainCategorySearchFilter.status = BaseConsts.ACTIVE
                    mainCategorySearchFilter.is_main_category = true
                    const { categories } = await getCategoriesList(mainCategorySearchFilter)
                    mainCategoriesList.value = categories
                }
            }
        };
        const mainCategoriesList = ref<Category[]>([])
        onMounted(async () => {
            await getCurrentCategory();
            let mainCategorySearchFilter = {} as CategorySearchFilter
            mainCategorySearchFilter.status = BaseConsts.ACTIVE
            mainCategorySearchFilter.per_page = 500
            mainCategorySearchFilter.is_main_category = true
            const { categories } = await getCategoriesList(mainCategorySearchFilter)
            mainCategoriesList.value = categories
        });
        const validationSchema = categoryvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentCategory?.value?.name ?? "",
                parent_id: currentCategory?.value?.parent?.id ?? undefined,
                status: currentCategory?.value?.status ?? 1,
            } : {
                name: "",
                status: 1,
                parent_id: undefined
            },
        });
        const resetPerant = () => {
            if (isCategory.value == false && currentCategory.value.parent?.id != undefined) {
                currentCategory.value.parent.id = undefined
                console.log(currentCategory.value.parent.id)
            }
        }
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            } else if (method == "Edit") {
                await onSubmitEdit();
            } else
                return;
        };
        const onSubmitAdd = handleSubmit(async (values) => {
            var categoryData = currentCategory.value;
            var categoryForm = currentCreateUpdateCategory.value
            if (isCategory.value == true) {
                categoryForm.name = categoryData.name
                categoryForm.parent_id = categoryData.parent?.id
                categoryForm.status = categoryData.status
            }
            else {
                categoryForm.name = categoryData.name
                categoryForm.status = categoryData.status
                categoryForm.parent_id = undefined

            }
            const { success, message, category } = await addCategory(categoryForm);
            if (success) {
                notif.dismissAll();
                await sleep(200);
                notif.success(t('toast.success.add'));
                router.push({ path: `/category` });
            } else {
                await sleep(200);
                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            var categoryData = currentCategory.value;
            var categoryForm = currentCreateUpdateCategory.value
            categoryForm.id = categoryData.id
            categoryForm.name = categoryData.name
            categoryForm.parent_id = categoryData.parent?.id
            categoryForm.status = categoryData.status
            const { success, message } = await editCategory(categoryForm);
            if (success) {
                notif.dismissAll();
                await sleep(200);
                notif.success(t('toast.success.edit'));
                router.push({ path: `/category` });
            } else {
                await sleep(200);
                notif.error(message)
            }
        };
        return { t, resetPerant, keyIncrement, isCategory, pageTitle, onSubmit, mainCategoriesList, currentCategory, viewWrapper, backRoute, CategoryConsts, categoryStore };
    },
    components: { ErrorMessage }
})

</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="categoryStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="name" v-slot="{ field }">
                                    <VLabel class="required">{{t('category.form.name')}}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentCategory.name" type="text" placeholder=""
                                            autocomplete="given-name" />
                                        <ErrorMessage class="help is-danger" name="name" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset" v-if="currentCategory.parent">
                        <div class="columns is-multiline">
                            <div class="is-flex is-justify-content-center">
                                <VControl class="ml-3">
                                    <VSwitchSegment @change="resetPerant" :key="keyIncrement" v-model="isCategory"
                                        :label-true="t('category.form.level_2')" :label-false="t('category.form.level_1')" color="success" />
                                </VControl>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField v-if="currentCategory.parent" id="parent_id">
                                    <VLabel>{{t('category.form.parent')}}</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select v-if="currentCategory" v-model="currentCategory.parent.id"
                                                :disabled="!isCategory">
                                                <VOption value="">{{t('category.form.parent')}}</VOption>
                                                <VOption v-for="parent in mainCategoriesList" :key="parent.id"
                                                    :value="parent.id">{{ parent.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                        <ErrorMessage class="help is-danger" name="parent_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="status" v-slot="{ field }">
                                    <VLabel class="required">{{ t('category.form.status') }}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentCategory.status" :value="CategoryConsts.ACTIVE"
                                            :label="CategoryConsts.showStatusName(1)" name="status" color="success" />
                                        <VRadio v-model="currentCategory.status" :value="CategoryConsts.INACTIVE"
                                            :label="CategoryConsts.showStatusName(0)" name="status" color="danger" />
                                        <ErrorMessage class="help is-danger" name="status" />
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
@import '/@src/scss/styles/formPage.scss';
</style>