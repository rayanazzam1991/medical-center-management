       
<script setup lang="ts">
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
import { useNotyf } from '/@src/composable/useNotyf';
import { Employee, EmployeeService, defaultEmployeeService } from '/@src/models/Employee/employee';
import { defaultTicket, TicketConsts } from '/@src/models/Sales/Ticket/ticket';
import { CreateTicketService, TicketServiceConsts } from '/@src/models/Sales/TicketService/ticketService';
import { WaitingList, defaultWaitingList, TicketServicesNotesHelper } from '/@src/models/Sales/WaitingList/waitingList';
import { moveTicketToNextWaitingList } from '/@src/services/Sales/Ticket/ticketService';
import { createTicketService, deleteTicketService, serveTicketService } from '/@src/services/Sales/TicketService/ticketServiceService';
import { getWaitingListByProvider, serveNextTicketInProviderWaitingList } from '/@src/services/Sales/WaitingList/waitingListService';
import { useEmployee } from '/@src/stores/Employee/employeeStore';
import { useTicketService } from '/@src/stores/Sales/TicketService/ticketServiceStore';
import { useWaitingList } from '/@src/stores/Sales/WaitingList/waitingListStore';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { toggleEmployeeAvailability } from '/@src/services/Employee/employeeService';
import { ServiceProvider, defaultServiceProvider } from '/@src/models/Sales/ServiceProvider/serviceProvider';
import { getEmployee } from '/@src/services/Employee/employeeService';
import { defaultService } from '/@src/models/Others/Service/service';
export interface EmployeeWaitingListProps {
    employeeIdFromRoute: boolean,
    employeeId: number | undefined
}
const props = withDefaults(defineProps<EmployeeWaitingListProps>(), {
    employeeIdFromRoute: true,
    employeeId: undefined,

})
const { t } = useI18n()
const notif = useNotyf() as Notyf
const waitingListStore = useWaitingList()
const ticketServiceStore = useTicketService()
const employeeWaitingList = ref<WaitingList>(defaultWaitingList)
const keyIncrement = ref(0)
const keyIncrementAddServiceModal = ref(0)
const employeeId = ref(0)
const route = useRoute();
const servingTicket = ref(defaultTicket)
const ticketServicesNotesHelper = ref<TicketServicesNotesHelper[]>([])
const serviceProviderServices = ref<EmployeeService[]>([])
const isThereServingTicket = ref(false)
const selectedServeServiceId = ref(0)
const selectedTicketId = ref(0)
const selectedServiceProviderId = ref(0)
const selectedServiceProviderPrice = ref(0)
const serveServiceConfirmationPopup = ref(false)
const deleteServiceConfirmationPopup = ref(false)
const addServicePopup = ref(false)
const intialLoading = ref(false)
const employeeName = ref('')
const loggedEmployee = ref<Employee>()
const employeeStore = useEmployee()
const isFirstTicket = ref(false)
const isAvailable = ref()
const isMounting = ref(false)
const disableAvailabilitySwitch = ref(true)
loggedEmployee.value = employeeStore.getEmployee()

if (props.employeeIdFromRoute) {
    // @ts-ignore
    employeeId.value = route.params.id as number ?? 0
} else {
    employeeId.value = props.employeeId
}
onMounted(async () => {
    if (employeeId.value != loggedEmployee.value?.id && !checkPermission(Permissions.SHOW_ALL_WAITING_LISTS)) {
        notif.error({ message: t('toast.error.cannot_access_waiting_list'), duration: 4000 })
    } else {
        intialLoading.value = true
        const { waiting_list } = await getWaitingListByProvider(employeeId.value)
        employeeWaitingList.value = waiting_list
        employeeName.value = employeeWaitingList.value.provider.user.first_name + ' ' + employeeWaitingList.value.provider.user.last_name
        isAvailable.value = Boolean(employeeWaitingList.value.provider.is_available) ?? false
        serviceProviderServices.value = employeeWaitingList.value.provider.services
        serveingServiceSetup()
        intialLoading.value = false
    }
    disableAvailabilitySwitch.value = false

});

const serveNext = async () => {
    const { success, message } = await serveNextTicketInProviderWaitingList(employeeId.value)
    if (success) {
        await refreshWaitingList()
        keyIncrement.value++
    } else {
        notif.error({ message: message, duration: 3000 })
    }
}
const refreshWaitingList = async () => {
    const { waiting_list } = await getWaitingListByProvider(employeeId.value)
    employeeWaitingList.value = waiting_list
    isAvailable.value = Boolean(employeeWaitingList.value.provider.is_available) ?? false
    serveingServiceSetup()

}
const markServiceAsServed = async () => {
    const serviceNote = ticketServicesNotesHelper.value.find((element) => element.requested_service_id == selectedServeServiceId.value)?.note
    const { success, message } = await serveTicketService(selectedServeServiceId.value, serviceNote)
    if (success) {
        await refreshWaitingList()
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    serveServiceConfirmationPopup.value = false
}
const deleteService = async () => {
    const { success, message } = await deleteTicketService(selectedServeServiceId.value)
    if (success) {
        notif.success(t('toast.success.remove'))
        await refreshWaitingList()
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    deleteServiceConfirmationPopup.value = false
}
const createNewTicketService = async () => {
    if (selectedServiceProviderId.value == 0) {
        notif.error({ message: t('toast.error.ticket.ticket_service_is_required'), duration: 3000 })
        return
    }
    const createTicketServiceData: CreateTicketService = {
        ticket_id: selectedTicketId.value,
        service_provider_id: selectedServiceProviderId.value,
        sell_price: selectedServiceProviderPrice.value
    }
    const { success, message } = await createTicketService(createTicketServiceData)
    if (success) {
        notif.success(t('toast.success.add'))
        await refreshWaitingList()
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    addServicePopup.value = false
}

const ticketServingDone = async () => {
    const { success, message } = await moveTicketToNextWaitingList(servingTicket.value.id)
    if (success) {
        await refreshWaitingList()
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    serveServiceConfirmationPopup.value = false
}



const serveingServiceSetup = () => {

    ticketServicesNotesHelper.value = []
    const firstServingTicket = employeeWaitingList.value.waiting_list.find((ticket) => ticket.ticket.status == TicketConsts.SERVING)?.ticket
    if (firstServingTicket && firstServingTicket.id != 0) {
        servingTicket.value = firstServingTicket
        isThereServingTicket.value = true
        servingTicket.value.requested_services.forEach((requestedService) => {
            if (requestedService.provider.id == employeeId.value && requestedService.status == TicketServiceConsts.NOT_SERVED) {
                ticketServicesNotesHelper.value.push({ requested_service_id: requestedService.id, note: requestedService.note })
            }

        });
    } else {
        isThereServingTicket.value = false
        const firstServingTicket = employeeWaitingList.value.waiting_list.find((ticket) => ticket.ticket.status == TicketConsts.WAITING)
        if (firstServingTicket?.turn_number == 1) {
            isFirstTicket.value = true
        } else {
            isFirstTicket.value = false
        }
    }

}

const updateTicketNotesHelper = (requestedServiceId: number) => {
    let requestedServiceHelper = ticketServicesNotesHelper.value.find((element) => element.requested_service_id == requestedServiceId)
    if (requestedServiceHelper)
        requestedServiceHelper.note = employeeWaitingList.value.waiting_list.find((ticket) => ticket.ticket.id == servingTicket.value.id)?.ticket.requested_services.find((service) => service.id == requestedServiceId)?.note

}

const serveConfirmation = (requestedServiceId: number) => {
    selectedServeServiceId.value = requestedServiceId
    serveServiceConfirmationPopup.value = true
}
watch(isAvailable, async (value) => {
    disableAvailabilitySwitch.value = true
    if (isMounting.value && !employeeStore.loading && !waitingListStore.loading) {
        const { message, success } = await toggleEmployeeAvailability(employeeWaitingList.value.provider.id ?? 0)
        if (success) {
            notif.success(t('toast.success.edit'))
            await refreshWaitingList()
            keyIncrement.value++
        } else {
            isAvailable.value = Boolean(employeeWaitingList.value.provider.is_available) ?? false
            notif.error({ message: message, duration: 3000 })
        }
    }
    isMounting.value = true
    disableAvailabilitySwitch.value = false

})
const checkIsThereServingTicket = () => {
    if (isThereServingTicket.value) {
        notif.dismissAll()
        notif.error({ message: t('toast.error.employee.cannot_change_avaiability'), duration: 3000 })
    }
}
const removeService = (requestedServiceId: number) => {
    selectedServeServiceId.value = requestedServiceId
    deleteServiceConfirmationPopup.value = true
}
const addNewService = () => {
    selectedTicketId.value = servingTicket.value.id
    selectedServiceProviderId.value = 0
    selectedServiceProviderPrice.value = 0
    keyIncrementAddServiceModal.value++
    addServicePopup.value = true
}
watch(selectedServiceProviderId, (value) => {
    let selectedService = serviceProviderServices.value.find((service) => service.id == value)
    if (selectedService) {
        selectedServiceProviderPrice.value = selectedService.price
    }
})
</script>
<template>
    <div class="header is-flex is-justify-content-space-between is-align-items-center">
        <h1>{{ t('employee.waiting_list.header_title') }} {{ employeeName }}</h1>
        <VField v-permission="Permissions.EMPLOYEE_AVAILABILITY_TOGGLE">
            <VControl>
                <VSwitchSegment :disabled="waitingListStore.loading || isThereServingTicket || disableAvailabilitySwitch"
                    color="success" @click="checkIsThereServingTicket"
                    :label-false="t('employee.waiting_list.is_not_available')"
                    :label-true="t('employee.waiting_list.is_available')" v-model="isAvailable" />
            </VControl>
        </VField>

    </div>

    <div class="waiting-list-outer-layout is-flex is-align-items-center is-justify-content-center ">
        <div v-if="intialLoading">
            <div class="columns is-multiline placeholder">
                <div ref="markdownContainer" class="column doc-column is-12">
                    <VPlaceholderPage :title="t('waiting_list.place_holder.title')"
                        :subtitle="t('waiting_list.place_holder.subtitle')" larger>
                        <template #image>
                            <img class="light-image" src="/@src/assets/illustrations/placeholders/search-1.svg" alt="" />
                            <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-1-dark.svg"
                                alt="" />
                        </template>
                    </VPlaceholderPage>
                </div>
            </div>
        </div>
        <div v-else-if="employeeWaitingList.waiting_list.length > 0" class="waiting-list-inner">
            <div class="waiting-lists-container is-flex has-slimscroll">
                <WaitingListComponent :key="keyIncrement" :waiting_list="employeeWaitingList.waiting_list"
                    :provider="employeeWaitingList.provider" />
            </div>
        </div>
        <div v-else>
            <div class="columns is-multiline placeholder">
                <div ref="markdownContainer" class="column doc-column is-12">
                    <VPlaceholderPage class="placeholder" :title="t('employee.waiting_list.no_data.title')"
                        :subtitle="t('employee.waiting_list.no_data.subtitle')" larger>
                        <template #image>
                            <img class="light-image" src="/@src/assets/illustrations/placeholders/having-coffee.svg"
                                alt="" />
                            <img class="dark-image" src="/@src/assets/illustrations/placeholders/having-coffee-dark.svg"
                                alt="" />
                        </template>
                    </VPlaceholderPage>
                </div>
            </div>
        </div>
        <div class="ticket-details-layout has-slimscroll ">
            <div class="ticket-details-inner is-flex-direction-column is-justify-content-space-between  ">
                <div class="ticket-content is-flex-grow-1" v-if="isThereServingTicket">
                    <div class="ticket-content-inner">
                        <div class="ticket-header">
                            <h1 class="ticket-title">
                                {{ t('employee.waiting_list.ticket_id') }} {{
                                    servingTicket.id
                                }}
                            </h1>
                            <h1 class="ticket-title">
                                {{ t('employee.waiting_list.customer_name') }}
                                {{ servingTicket.customer.user.first_name }}
                                {{ servingTicket.customer.user.last_name }}
                            </h1>

                        </div>
                        <div class="ticket-services">
                            <h1 class="services-header">
                                {{ t('employee.waiting_list.requested_services') }}
                            </h1>
                            <div class="columns is-multiline mb-0 pt-2 pr-2">
                                <div class="service-details-header column is-2">
                                    <p>{{ t('employee.waiting_list.service_name') }}</p>
                                </div>
                                <div class="service-details-header column is-2">
                                    <p> {{ t('employee.waiting_list.service_provider') }}</p>
                                </div>
                                <div class="service-details-header column is-4">
                                    <p>
                                        {{ t('employee.waiting_list.notes') }}</p>
                                </div>
                                <div class="service-details-header column is-2">
                                    <p> {{ t('employee.waiting_list.status') }}</p>
                                </div>
                                <div class="service-details-header column is-1">
                                    <p> {{ t('employee.waiting_list.actions') }}</p>
                                </div>

                            </div>

                            <div v-for="requested_service in servingTicket.requested_services" :key="requested_service.id"
                                class="columns is-multiline pr-2 service-row">
                                <div class="service-details column is-2 mb-0 pb-0">
                                    <p>{{ requested_service.service.name }}</p>
                                </div>
                                <div class="service-details column is-2">
                                    <p :class="[requested_service.provider.id == employeeId && 'has-text-primary']">
                                        {{ requested_service.provider.user.first_name }}
                                        {{ requested_service.provider.user.last_name }}</p>
                                </div>
                                <div class="service-details column is-4  mb-0 pb-0">
                                    <p
                                        v-if="requested_service.provider.id != employeeId || requested_service.status == TicketServiceConsts.SERVED">
                                        {{ requested_service.note ?? '-' }}</p>
                                    <div v-else>
                                        <VField>
                                            <VControl>
                                                <VTextarea @input="() => updateTicketNotesHelper(requested_service.id)"
                                                    v-model="requested_service.note" rows="1"
                                                    :placeholder="t('employee.waiting_list.type_notes')">
                                                </VTextarea>
                                            </VControl>
                                        </VField>
                                    </div>
                                </div>
                                <div class="service-details column is-2  mb-0 pb-0">
                                    <p> {{ TicketServiceConsts.getStatusName(requested_service.status) }}</p>
                                </div>
                                <div class="service-details column is-2  mb-0 pb-0">
                                    <VButton v-permission="Permissions.SHOW_WAITING_LIST_SERVE_CLIENT"
                                        @click="serveConfirmation(requested_service.id)" color="primary" raised
                                        v-if="requested_service.provider.id == employeeId && requested_service.status == TicketServiceConsts.NOT_SERVED">
                                        {{ t('employee.waiting_list.make_served') }}
                                    </VButton>
                                </div>


                                <div class="service-details column is-10 pt-0">
                                    <p class="pt-0" v-if="requested_service.service.has_item">
                                        {{ t('employee.waiting_list.service_items') }}
                                        <span v-for="(item, index) in requested_service.service.service_items">
                                            {{ item.item.name }} ({{ t('employee.waiting_list.service_items_quantity')
                                            }}
                                            {{ item.quantity }})
                                            {{ index !== requested_service.service.service_items.length - 1 ? '|' : ''
                                            }}
                                        </span>
                                    </p>
                                </div>
                                <div class="service-details column is-2 pt-0">
                                    <VIconButton v-permission="Permissions.TICKET_SERVICE_DELETE"
                                        v-if="requested_service.provider.id == employeeId && requested_service.status == TicketServiceConsts.NOT_SERVED"
                                        icon="feather:trash-2" @click="removeService(requested_service.id)" color="danger">
                                    </VIconButton>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                <div v-else class="is-flex is-justify-content-center margin-center">

                    <VButton class="center" v-permission="Permissions.SHOW_WAITING_LIST_SERVE_CLIENT"
                        :loading="waitingListStore.loading" @click="serveNext" color="primary" raised
                        v-if="!isThereServingTicket"
                        :disabled="employeeWaitingList.waiting_list.length == 0 || !employeeWaitingList.provider.is_available">
                        {{ !isFirstTicket ? t('employee.waiting_list.serve_next') : t('employee.waiting_list.serve_first')
                        }}
                    </VButton>
                </div>
                <div v-if="isThereServingTicket" class="ticket-footer">
                    <div class="ticket-footer-inner">
                        <VButton v-permission="Permissions.TICKET_SERVICE_CREATE" outlined
                            :loading="waitingListStore.loading" @click="addNewService" color="primary"
                            v-if="isThereServingTicket"> {{
                                t(`employee.waiting_list.add_new_service`) }} </VButton>
                        <VButton v-permission="Permissions.SHOW_WAITING_LIST_SERVE_CLIENT"
                            :loading="waitingListStore.loading" @click="ticketServingDone" color="primary" raised
                            v-if="isThereServingTicket"> {{
                                t(`employee.waiting_list.done`) }} </VButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <VModal :title="t('employee.waiting_list.serve_confirmation.title')" :open="serveServiceConfirmationPopup"
        actions="center" @close="serveServiceConfirmationPopup = false">
        <template #content>
            <VPlaceholderSection :title="t('employee.waiting_list.serve_confirmation.caution')"
                :subtitle="t('employee.waiting_list.serve_confirmation.subtitle')" />
        </template>
        <template #action="{ close }">
            <VButton :loading="ticketServiceStore.loading" color="primary" raised @click="markServiceAsServed">{{
                t('modal.buttons.confirm')
            }}</VButton>
        </template>
    </VModal>
    <VModal :title="t('employee.waiting_list.delete_confirmation.title')" :open="deleteServiceConfirmationPopup"
        actions="center" @close="deleteServiceConfirmationPopup = false">
        <template #content>
            <VPlaceholderSection :title="t('employee.waiting_list.delete_confirmation.caution')"
                :subtitle="t('employee.waiting_list.delete_confirmation.subtitle')" />
        </template>
        <template #action="{ close }">
            <VButton :loading="ticketServiceStore.loading" color="primary" raised @click="deleteService">{{
                t('modal.buttons.confirm')
            }}</VButton>
        </template>
    </VModal>
    <VModal :key="keyIncrementAddServiceModal" :title="t('employee.waiting_list.add_service_modal.title')"
        :open="addServicePopup" actions="center" @close="addServicePopup = false">
        <template #content>
            <div class="form-fieldset">
                <div class="columns is-multiline">
                    <div class="column is-12 columns">
                        <VField class="column is-9" id="user_status_id">
                            <VLabel>{{ t('employee.waiting_list.add_service_modal.service') }}</VLabel>
                            <VControl>
                                <VSelect v-model="selectedServiceProviderId">
                                    <VOption v-for="service in serviceProviderServices" :key="service.id"
                                        :value="service.id">
                                        {{
                                            service.service.name
                                        }}
                                    </VOption>
                                </VSelect>
                            </VControl>
                        </VField>
                        <VField class="column is-3" id="user_status_id">
                            <VLabel>{{ t('employee.waiting_list.add_service_modal.service_price') }}</VLabel>
                            <VControl>
                                <VInput disabled v-model="selectedServiceProviderPrice" type="number" />
                            </VControl>
                        </VField>
                    </div>
                </div>
            </div>
        </template>
        <template #action="{ close }">
            <VButton :loading="ticketServiceStore.loading" color="primary" raised @click="createNewTicketService">{{
                t('modal.buttons.add') }}</VButton>
        </template>
    </VModal>
</template>
    
<style  lang="scss">
.header {
    background-color: var(--white);
    min-height: 50px;
    border-radius: var(--radius-large);
    border: 1px solid var(--fade-grey-dark-3);
    padding: 20px;

    h1 {
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1.3;
    }

}

.margin-center {

    margin-top: 25vh;

}

.waiting-list-outer-layout {
    flex: 1;
    display: inline-block;
    width: 100%;
    height: 60vh;
    padding: 20px;
    background-color: var(--white);
    border-radius: var(--radius-large);
    border: 1px solid var(--fade-grey-dark-3);
    transition: all .3s;

    .ticket-details-layout {
        flex-grow: 1;
        height: 100%;
        width: 0;
        padding: 0.6rem;
        padding-bottom: 1.1rem;
        overflow: auto;

        .ticket-details-inner {

            width: 100%;
            min-height: 100%;
            background: #e3e4e5;
            border-radius: var(--radius-large);
            padding: 0.5rem;
            display: flex;

            .ticket-content {
                max-width: 900px;
                flex-grow: 1;

                .ticket-content-inner {
                    padding: 1rem;

                    .ticket-header {
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--fade-grey-dark-8);


                        .ticket-title {
                            width: 100%;
                            font-family: var(--font-alt);
                            font-size: large;
                            font-weight: 600;
                            text-align: start;
                        }
                    }

                    .ticket-services {
                        padding-top: 10px;

                        .services-header {
                            font-family: var(--font-alt);
                            font-size: medium;
                            font-weight: 600;
                            text-align: start;

                        }

                        .columns {

                            .service-details {

                                p {
                                    font-family: var(--font-alt);
                                    font-size: medium;
                                    text-align: start;
                                }

                            }

                            .service-details-header {

                                p {
                                    font-family: var(--font-alt);
                                    font-size: medium;
                                    font-weight: 600;
                                    text-align: start;
                                }

                            }

                            &.service-row {
                                border-bottom: 1px solid var(--fade-grey-dark-8);
                            }

                            &.service-row:last-child {
                                border-bottom: none;
                            }
                        }
                    }
                }
            }

            .ticket-footer {
                min-height: 65px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                border-top: 1px solid var(--fade-grey-dark-8);

                .ticket-footer-inner {
                    padding: 1.25rem 1rem;

                    .button {
                        margin: 0 .5rem;
                        height: 40px;
                    }
                }

            }

        }

        .placeholder {
            min-height: 50%;
        }

    }

}

.page-placeholder {
    .placeholder-content {

        p {
            &.is-larger {
                width: 320px !important;
            }
        }
    }
}

.waiting-list-inner {
    height: 100%;
    overflow: hidden;



}

.waiting-lists-container {
    padding: 1rem;
    padding-bottom: 0;
    gap: 20px;
    height: 100%;
    width: 100%;



}

.is-dark {

    .header {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);
    }

    .waiting-list-outer-layout {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);

        .ticket-details-layout {

            .ticket-details-inner {

                width: 100%;
                min-height: 100%;
                background: var(--dark-sidebar-light-15);

                .ticket-content {

                    .ticket-content-inner {

                        .ticket-header {
                            border-color: var(--dark-sidebar-light-12) !important;

                        }

                        .ticket-services {

                            .columns {

                                &.service-row {
                                    border-color: var(--dark-sidebar-light-12) !important;
                                }

                                &.service-row:last-child {
                                    border-bottom: none;
                                }


                            }
                        }

                    }
                }

                .ticket-footer {
                    border-color: var(--dark-sidebar-light-12) !important;

                }


            }
        }

    }


}
</style>
    