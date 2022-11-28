<script  lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue';
import { addRoom } from '/@src/composable/Others/Room/addRoom'
import { editRoom } from '/@src/composable/Others/Room/editRoom'
import { Room } from '/@src/utils/api/Others/Room'
import { defaultRoom } from '/@src/stores/Others/Room/RoomStore'
import { getRoom } from '/@src/composable/Others/Room/getRoom'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { RoomConsts } from '/@src/utils/consts/room';
import { useNotyf } from '/@src/composable/useNotyf';
import { toFormValidator } from '@vee-validate/zod';
import { useForm, ErrorMessage } from 'vee-validate';
import { z as zod } from 'zod'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { Department } from '/@src/utils/api/Others/Department'
import { defaultDepartmentSearchFilter } from '/@src/stores/Others/Department/departmentStore'


export default defineComponent({
    props: {
        formType: {
            type: String,
            default: '',
        },
    },
    components: { ErrorMessage },

    emits: ['onSubmit'],
    setup(props, context) {
        const viewWrapper = useViewWrapper()
        viewWrapper.setPageTitle('Room')
        const head = useHead({
            title: 'Room',
        })
        const notif = useNotyf()

        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()

        const pageTitle = formType.value + ' ' + viewWrapper.pageTitle
        const backRoute = '/room'
        const currentRoom = ref(defaultRoom)
        const roomId = ref(0)
        // @ts-ignore
        roomId.value = route.params?.id as number ?? 0
        const getCurrentRoom = async () => {
            if (roomId.value === 0) {
                currentRoom.value.number = 0
                currentRoom.value.floor = 0
                // currentRoom.value.department = 
                currentRoom.value.status = 0
                return
            }
            const room = await getRoom(roomId.value)
            console.log("sad", room)
            currentRoom.value = room != undefined ? room : defaultRoom

        }
        const departments2 = ref<Department[]>([])
        onMounted(async () => {
            const { departments } = await getDepartmentsList(defaultDepartmentSearchFilter)
            departments2.value = departments
        })
        onMounted(() => {
            getCurrentRoom()
        }
        )


        const validationSchema = toFormValidator(
            zod
                .object({
                    number: zod
                        .number({
                            required_error: 'This field is required',
                        }),
                    floor: zod
                        .number({
                            required_error: 'This field is required',
                        })
                        .min(1, 'This field is required'),
                    status: zod
                        .number({ required_error: 'Please choose one' }),
                    department: zod
                        .number({ required_error: 'Please choose one' }),
                })

        )

        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: {
                number: 0,
                floor: 0,
                status: 0,
                department: departments2,
            },
        })

        const onSubmit = async (method: String) => {
            if (method == 'Add') {
                await onSubmitAdd()
            }
            else if (method == 'Edit') {
                await onSubmitEdit()
            }
            else return
        }
        const onSubmitAdd = handleSubmit(async (values) => {

            var roomData = currentRoom.value
            roomData = await addRoom(roomData) as Room
            // @ts-ignore
            notif.dismissAll()
            // @ts-ignore

            notif.success(`${roomData.name} ${viewWrapper.pageTitle} was added successfully`)


            router.push({ path: `/room/${roomData.id}` })

        })
        const onSubmitEdit = async () => {
            const roomData = currentRoom.value
            await editRoom(roomData)
            // @ts-ignore

            notif.dismissAll()
            // @ts-ignore

            notif.success(`${roomData.name} ${viewWrapper.pageTitle} was edited successfully`)

            router.push({ path: `/room/${roomData.id}` })


        }

        return { pageTitle, onSubmit, currentRoom, viewWrapper, backRoute, RoomConsts, departments2 }
    },


})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="number" v-slot="{ field }">
                                    <VLabel>{{ viewWrapper.pageTitle }} number</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentRoom.number" type="text" placeholder=""
                                            autocomplete="given-number" />
                                        <ErrorMessage name="number" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="floor" v-slot="{ field }">
                                    <VLabel>{{ viewWrapper.pageTitle }} floor</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentRoom.floor" type="text" placeholder=""
                                            autocomplete="given-floor" />
                                        <p v-if="field?.errorMessage" class="help is-danger">
                                            {{ field.errorMessage }}
                                        </p>

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField class="column ">
                                    <VLabel>{{ viewWrapper.pageTitle }} department</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentRoom.department" v-model="currentRoom.department"
                                            class="is-rounded">
                                            <VOption value="">Department</VOption>
                                            <VOption v-for="department in departments2" :key="department.id"
                                                :value="department.id">{{ department.name }}
                                            </VOption>
                                        </VSelect>
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
                                    <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentRoom.status" :value="RoomConsts.INACTIVE"
                                            :label="RoomConsts.showStatusName(0)" name="status" color="warning" />

                                        <VRadio v-model="currentRoom.status" :value="RoomConsts.ACTIVE"
                                            :label="RoomConsts.showStatusName(1)" name="status" color="success" />

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

.is-navbar {
    .form-layout {
        margin-top: 30px;
    }
}

.filter {
    margin: 1rem;
}

.justify-content {
    display: flex;
    align-items: baseline;
}

.form-layout {
    &.is-split {
        max-width: 840px;

        .form-outer {
            .form-body {
                padding: 0;
                width: 100%;

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
                        width: 20%;
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
