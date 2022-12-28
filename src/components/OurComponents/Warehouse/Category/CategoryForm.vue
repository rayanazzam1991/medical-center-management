<script lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { defaultCategory, Category, CategoryConsts, defaultCreateUpdateCategory, defaultCategorySearchFilter, defaultMainCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getCategory, addCategory, editCategory, getParentsList } from '/@src/services/Warehouse/Category/categoryService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { categoryvalidationSchema } from '/@src/rules/Warehouse/Category/categoryAddValidation';
import sleep from "/@src/utils/sleep";
import { useCategory } from '/@src/stores/Warehouse/Category/CategoryStore';


export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle("Category");
        const head = useHead({
            title: "Category",
        });
        const categoryStore = useCategory()
        const notif = useNotyf()
        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()

        const pageTitle = formType.value + ' ' + viewWrapper.pageTitle
        const backRoute = '/category'
        const currentCategory = ref(defaultCategory)
        const currentCreateUpdateCategory = ref(defaultCreateUpdateCategory)
        const categoryId = ref(0);
        const isCategory = ref(false)
        const keyIncrement = ref(0)
        console.log(isCategory.value)

        // @ts-ignore
        categoryId.value = route.params?.id as number ?? 0;
        const getCurrentCategory = async () => {
            if (categoryId.value === 0) {
                currentCategory.value.name = ''
                currentCategory.value.parent_id = defaultCategory
                currentCategory.value.status = 1
                return
            }
            else {
                const { category } = await getCategory(categoryId.value);
                if (currentCategory.value.parent_id != undefined) {
                    isCategory.value = true
                    keyIncrement.value++
                }
                currentCategory.value = category != undefined ? category : defaultCategory;
                console.log(currentCategory.value)
            }


        };
        onMounted(async () => {
            await getCurrentCategory();
        });
        const mainCategoriesList = ref<Category[]>([])
        onMounted(async () => {
            const { categories } = await getParentsList()
            mainCategoriesList.value = categories
            console.log(mainCategoriesList.value)
        })

        const validationSchema = categoryvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentCategory?.value?.name ?? "",
                parent_id: currentCategory?.value?.parent_id?.id ?? 0,
                status: currentCategory?.value?.status ?? 1,
            } : {
                name: "",
                status: 1,
                parent_id: 0
            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            } else if (method == "Edit") {
                await onSubmitEdit();
            } else
                return;
        };
        const onSubmitAdd = handleSubmit(async (values) => {
            var categoryData = currentCreateUpdateCategory.value;
            const { success, message, category } = await addCategory(categoryData);
            if (success) {
                // @ts-ignore
                notif.dismissAll();
                await sleep(200);
                // @ts-ignore
                notif.success(`${category.name} ${viewWrapper.pageTitle} was added successfully`);
                router.push({ path: `/category` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = async () => {
            const categoryData = currentCreateUpdateCategory.value;
            const { message, success } = await editCategory(categoryData);
            if (success) {
                // @ts-ignore
                notif.dismissAll();
                await sleep(200);

                // @ts-ignore
                notif.success(`${categoryData.name} ${viewWrapper.pageTitle} was edited successfully`);
                router.push({ path: `/category` });
            } else {
                await sleep(200);
                notif.error(message)

            }
        };

        return { keyIncrement, isCategory, pageTitle, onSubmit, mainCategoriesList, currentCategory, viewWrapper, backRoute, CategoryConsts, categoryStore };
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
                        <div class="column is-6">
                            <h4>{{ pageTitle }}</h4>

                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="name" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} name</VLabel>
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
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="is-flex is-justify-content-center">
                                <VControl class="ml-3">
                                    <VSwitchSegment :key="keyIncrement" v-model="isCategory" label-true="Level 2"
                                        label-false="Level 1" color="success" />
                                </VControl>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="parent_id">
                                    <VLabel>{{ viewWrapper.pageTitle }} Parent</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentCategory.parent_id" v-model="currentCategory.parent_id.id"
                                            :disabled="!isCategory">
                                            <VOption value="">Parent</VOption>
                                            <VOption v-for="parent in mainCategoriesList" :key="parent.id"
                                                :value="parent.id">{{ parent.name }}
                                            </VOption>
                                        </VSelect>
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
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentCategory.status" :value="CategoryConsts.INACTIVE"
                                            :label="CategoryConsts.showStatusName(0)" name="status" color="warning" />
                                        <VRadio v-model="currentCategory.status" :value="CategoryConsts.ACTIVE"
                                            :label="CategoryConsts.showStatusName(1)" name="status" color="success" />
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