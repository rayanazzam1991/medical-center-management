<script  lang="ts">
import { useHead } from '@vueuse/head';
import { useForm, ErrorMessage } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultItem, defaultCreateUpdateItem, Item, ItemConsts } from '/@src/models/Warehouse/Item/item';
import { itemvalidationSchema } from '/@src/rules/Warehouse/Item/itemValidation';
import { getItem, addItem, editItem } from '/@src/services/Warehouse/Item/itemService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
import { Category, CategorySearchFilter, defaultCategory, defaultCategorySearchFilter } from '/@src/models/Warehouse/Category/category';
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService';


export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    components: { ErrorMessage },
    emits: ["onSubmit"],
    setup(props, context) {
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle("Item");
        const head = useHead({
            title: "Item",
        });
        const itemStore = useItem()
        const notif = useNotyf();
        const formType = ref("");
        formType.value = props.formType;
        const route = useRoute();
        const router = useRouter();
        const pageTitle = formType.value + " " + viewWrapper.pageTitle;
        const backRoute = "/item";
        const currentItem = ref(defaultItem);
        const currentCreateUpdateItem = ref(defaultCreateUpdateItem)
        const itemId = ref(0);
        const selectedCategoryId = ref()
        const subcategoeisList = ref<Category[]>([])
        const allCategoriesList = ref<Category[]>([])
        // @ts-ignore
        itemId.value = route.params?.id as number ?? 0;
        const getCurrentItem = async () => {
            if (itemId.value === 0) {
                currentItem.value.name = ''
                currentItem.value.status = 1
                currentItem.value.description = undefined
                currentItem.value.category = defaultCategory
                currentItem.value.price = 0
                currentItem.value.cost = 0
                currentItem.value.quantity = 0
                currentItem.value.min_quantity = 0
                return
            }
            const { item } = await getItem(itemId.value);
            currentItem.value = item != undefined ? item : defaultItem;
            selectedCategoryId.value = currentItem.value.category.parent?.id ?? 0

        };
        const mainCategoriesList = ref<Category[]>([])
        onMounted(async () => {
            const allCategories = await getFilterCategoriesList(defaultCategorySearchFilter)
            allCategoriesList.value = allCategories.categories
            mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
            await getCurrentItem();
            let categoriesFilter = defaultCategorySearchFilter
            categoriesFilter.parent_id = selectedCategoryId.value
            const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
            subcategoeisList.value = SubCategory


        })
        const getSubCategoryByCategroy = () => {
            let categoriesFilter = {} as CategorySearchFilter
            categoriesFilter.parent_id = selectedCategoryId.value
            const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
            subcategoeisList.value = SubCategory

        }
        const validationSchema = itemvalidationSchema
        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                name: currentItem.value.name ?? "",
                status: currentItem.value.status ?? 1,
                description: currentItem.value.description ?? undefined,
                category_id: currentItem.value.category.id ?? undefined,
                price: currentItem.value.price ?? 0,
                cost: currentItem.value.cost ?? 0,
                quantity: currentItem.value.quantity ?? 0,
                min_quantity: currentItem.value.min_quantity ?? 0,
            } : {
                name: '',
                quantity: 0,
                min_quantity: 0,
                price: 0,
                cost: 0,
                description: '',
                category_id: undefined,
                status: 1,

            },
        });
        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            }
            else if (method == "Edit") {
                await onSubmitEdit();
            }
            else
                return;
        };
        const onSubmitAdd = handleSubmit(async (values) => {
            let itemData = currentItem.value
            let itemForm = currentCreateUpdateItem.value
            itemForm.name = itemData.name
            itemForm.quantity = itemData.quantity
            itemForm.min_quantity = itemData.min_quantity
            itemForm.price = itemData.price
            itemForm.cost = itemData.cost
            itemForm.description = itemData.description
            itemForm.category_id = itemData.category.id ?? 0
            itemForm.status = itemData.status
            const { item, success, message } = await addItem(itemForm)

            if (success) {
                // @ts-ignore
                notif.dismissAll();
                await sleep(200);
                // @ts-ignore
                notif.success(`${item.name} ${viewWrapper.pageTitle} was added successfully`);
                await sleep(500)
                router.push({ path: `/item/${item.id}` });
            } else {
                await sleep(200);

                notif.error(message)
            }
        });
        const onSubmitEdit = handleSubmit(async () => {
            let itemData = currentItem.value
            let itemForm = currentCreateUpdateItem.value
            itemForm.id = itemData.id
            itemForm.name = itemData.name
            itemForm.quantity = itemData.quantity
            itemForm.min_quantity = itemData.min_quantity
            itemForm.price = itemData.price
            itemForm.cost = itemData.cost
            itemForm.description = itemData.description
            itemForm.category_id = itemData.category.id ?? 0
            itemForm.status = itemData.status
            const { success, message } = await editItem(itemForm);
            if (success) {
                // @ts-ignore
                notif.dismissAll();
                await sleep(200);
                // @ts-ignore
                notif.success(`${itemData.name} ${viewWrapper.pageTitle} was edited successfully`);
                await sleep(500);
                router.push({ path: `/item/${itemData.id}` });
            } else {
                await sleep(200);
                notif.error(message)
            }
        });
        return { selectedCategoryId, getSubCategoryByCategroy, subcategoeisList, mainCategoriesList, pageTitle, onSubmit, currentItem, viewWrapper, backRoute, ItemConsts, itemStore };
    },
})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="itemStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="name" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentItem.name" type="text" placeholder=""
                                            autocomplete="given-name" />
                                        <ErrorMessage name="name" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField>
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} Level 1</VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getSubCategoryByCategroy" v-if="currentItem"
                                                v-model="selectedCategoryId">
                                                <VOption>Level 1</VOption>
                                                <VOption v-for="category in mainCategoriesList" :key="category.id"
                                                    :value="category.id">{{ category.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="category_id">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} Level 2</VLabel>
                                    <VControl>
                                        <VSelect :disabled="selectedCategoryId == undefined" v-if="currentItem.category"
                                            v-model="currentItem.category.id">
                                            <VOption>Level 2</VOption>
                                            <VOption v-for="category in subcategoeisList" :key="category.id"
                                                :value="category.id">{{
                                                    category.name
                                                }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="category_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="price" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} Price </VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput v-model="currentItem.price" type="number" />
                                        <ErrorMessage name="price" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="cost" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} Cost </VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput v-model="currentItem.cost" type="number" />
                                        <ErrorMessage name="cost" class="help is-danger" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="quantity" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} Quantity</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentItem.quantity" type="number" />
                                        <ErrorMessage name="quantity" class="help is-danger" />

                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="min_quantity" v-slot="{ field }">
                                    <VLabel class="optional">{{ viewWrapper.pageTitle }} Min_Quantity</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentItem.min_quantity" type="number" />
                                        <ErrorMessage name="min_quantity" class="help is-danger" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="description">
                                    <VLabel class="optional">Description </VLabel>
                                    <VControl>
                                        <VTextarea v-model="currentItem.description" />
                                        <ErrorMessage class="help is-danger" name="description" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="status" v-slot="{ field }">
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentItem.status" :value="ItemConsts.ACTIVE"
                                            :label="ItemConsts.showStatusName(1)" name="status" color="success" />
                                        <VRadio v-model="currentItem.status" :value="ItemConsts.INACTIVE"
                                            :label="ItemConsts.showStatusName(0)" name="status" color="warning" />
                                        <ErrorMessage name="status" class="help is-danger" />
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
