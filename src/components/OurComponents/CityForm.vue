<script  lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue';
import { addCity } from '/@src/composable/Others/City/addCity'
import { editCity } from '/@src/composable/Others/City/editCity'
import { City } from '/@src/utils/api/Others/City'
import { getCityFromStore } from '/@src/composable/Others/City/getCityFromStore'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { CityConsts } from '/@src/utils/consts/city';

export default defineComponent({
    props: {
        formType: {
            type: String,
            default: '',
        },
    },

    emits: ['onSubmit'],
    setup(props, context) {
        const viewWrapper = useViewWrapper()
        viewWrapper.setPageTitle('City')
        const head = useHead({
            title: 'City',
        })

        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()

        const pageTitle = formType.value + ' ' + viewWrapper.pageTitle
        const backRoute = '/city'
        const cityId = ref(0)
        const cityName = ref('')
        const cityStatus = ref(0)
        // @ts-ignore
        cityId.value = route.params?.id as number ?? 0
        const getCity = async () => {
            console.log('GetCity')
            const { city } = await getCityFromStore(cityId.value)
            cityName.value = city.name
            cityStatus.value = city.status

        }
        onMounted(() => { getCity() })



        const onSubmitAdd = async () => {
            const cityData: City = {
                name: cityName.value,
                status: cityStatus.value,
            }
            await addCity(cityData)
            router.push({name: '/city/'})

        }
        const onSubmitEdit = async () => {
            const cityData: City = {
                id: cityId.value,
                name: cityName.value,
                status: cityStatus.value,
            }
            await editCity(cityData)
            router.push({name: '/city/'})


        }

        return { pageTitle, getCity, onSubmitAdd, onSubmitEdit, cityName, cityStatus, head, backRoute, CityConsts }
    },


})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader v-if="formType === 'Add'" :title="pageTitle" :form_submit_name="formType" :back_route="backRoute"
            @onSubmit="onSubmitAdd" />
        <FormHeader v-if="formType === 'Edit'" :title="pageTitle" :form_submit_name="formType" :back_route="backRoute"
            @onSubmit="onSubmitEdit" />
        <form class="form-layout is-split">
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
                                    <VLabel>City Name</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="cityName" type="text" placeholder=""
                                            autocomplete="given-name" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField>
                                    <VControl>
                                        <VRadio v-model="cityStatus" :value="CityConsts.INACTIVE"
                                            :label="CityConsts.showStatusName(0)" name="outlined_radio"
                                            color="warning" />

                                        <VRadio v-model="cityStatus" :value="CityConsts.ACTIVE"
                                            :label="CityConsts.showStatusName(1)" name="outlined_radio"
                                            color="success" />

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
<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.is-navbar {
    .form-layout {
        margin-top: 30px;
    }
}

.form-layout {
    max-width: 740px;
    margin: 0 auto;

    &.is-split {
        max-width: 840px;

        .form-outer {
            .form-body {
                padding: 0;

                .form-section {
                    display: flex;
                    padding: 20px;

                    &.is-grey {
                        background: #fafafa;
                    }

                    .left,
                    .right {
                        padding: 20px 40px;
                        width: 50%;

                        h3 {
                            font-family: var(--font-alt);
                            font-weight: 600;
                            font-size: 0.95rem;
                            color: var(--dark-text);
                            margin-bottom: 20px;
                        }
                    }

                    .left {
                        position: relative;
                        border-right: 1px solid var(--fade-grey-dark-3);

                        .operator {
                            position: absolute;
                            top: 17px;
                            right: -10px;
                            text-transform: uppercase;
                            font-family: var(--font);
                            font-weight: 500;
                            color: var(--dark-text);
                            background: var(--white);
                            padding: 4px 0;
                        }
                    }

                    .radio-pills {
                        display: flex;
                        justify-content: space-between;

                        .radio-pill {
                            position: relative;

                            input {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: 100%;
                                opacity: 0;
                                cursor: pointer;

                                &:checked {
                                    +.radio-pill-inner {
                                        background: var(--primary);
                                        border-color: var(--primary);
                                        box-shadow: var(--primary-box-shadow);
                                        color: var(--white);
                                    }
                                }
                            }

                            .radio-pill-inner {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 60px;
                                height: 40px;
                                background: var(--white);
                                border: 1px solid var(--fade-grey-dark-3);
                                border-radius: 8px;
                                font-family: var(--font);
                                font-weight: 600;
                                font-size: 0.9rem;
                                transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                                    height 0.3s, width 0.3s;
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        &.is-grey {
                            background: var(--dark-sidebar-light-4) !important;
                        }

                        h3 {
                            color: var(--dark-dark-text);
                        }

                        .left {
                            border-color: var(--dark-sidebar-light-12) !important;

                            .operator {
                                background: var(--dark-sidebar-light-6) !important;
                                color: var(--dark-dark-text);
                            }

                            .radio-pills {
                                .radio-pill {
                                    input {
                                        &:checked+.radio-pill-inner {
                                            border-color: var(--primary);
                                            background: var(--primary);
                                            box-shadow: var(--primary-box-shadow);
                                            color: var(--smoke-white);
                                        }
                                    }

                                    .radio-pill-inner {
                                        background: var(--dark-sidebar-light-2);
                                        border-color: var(--dark-sidebar-light-12);
                                        color: var(--dark-dark-text);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        flex-direction: column;
                        padding-right: 0;
                        padding-left: 0;

                        .left,
                        .right {
                            width: 100%;
                            padding-right: 30px;
                            padding-left: 30px;
                        }

                        .left {
                            border-right: none;
                            border-bottom: 1px solid var(--fade-grey-dark-3);
                            padding-bottom: 40px;

                            .operator {
                                top: unset;
                                bottom: -14px;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                                text-align: center;
                                max-width: 60px;
                            }
                        }

                        .right {
                            padding-top: 30px;
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        padding-right: 0;
                        padding-left: 0;
                    }
                }
            }
        }
    }
}
</style>
