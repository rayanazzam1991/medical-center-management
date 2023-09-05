<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { defaultEmployee, Employee } from '/@src/models/Employee/employee';
import { TicketConsts } from '/@src/models/Sales/Ticket/ticket';
import { EmployeeWaitingList } from '/@src/models/Sales/WaitingList/waitingList';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import Echo from 'laravel-echo'
import Socket from 'socket.io-client'
import { useAuth } from '/@src/stores/Others/User/authStore';
import { sendAlertToProvider } from '/@src/services/Sales/WaitingList/waitingListService'
import { useNotyf } from '/@src/composable/useNotyf';
import { Notyf } from 'notyf';


export interface WaitingListComponentProps {
    waiting_list: EmployeeWaitingList[],
    provider: Employee,
    current_turn_number: number,
    withChangeAvailability: boolean,
    withAlertProvider: boolean,
}
const emits = defineEmits<{
    (e: 'toggleAvailability', employeeId: number): void
}>()
window.io = Socket
const userAuth = useAuth()
const keyIncrement = ref(0)
const props = withDefaults(defineProps<WaitingListComponentProps>(), {
    waiting_list: () => [],
    provider: () => defaultEmployee,
    current_turn_number: undefined,
    withChangeAvailability: false,
    withAlertProvider: false,

})

onMounted(async () => {
    let hostName = import.meta.env.VITE_SOCEKT_HOST;
    let echo = new Echo({
        broadcaster: 'socket.io',
        host: hostName + ':6001',
        authEndpoint: hostName + '/broadcasting/auth',
        auth:
        {
            headers:
            {
                'Accept': 'application/json',
                Authorization: `Bearer ${userAuth.token}`,
            }
        },
        rejectUnauthorized: false,
    });
    echo.private('waitingList')
        .listen("WaitingListsEvent", async (e: any) => {

            if (provider.value.id === e.employee_id) {
                if (provider.value.is_available !== e.waiting_list.provider.is_available) {
                    provider.value = e.waiting_list.provider;
                }
                if (props.current_turn_number !== e.waiting_list.current_turn_number) {
                    props.current_turn_number = e.waiting_list.current_turn_number
                }
            }

        });

});

const { t } = useI18n()
const waitingList = ref<EmployeeWaitingList[]>([])
const provider = ref<Employee>(defaultEmployee)
const notif = useNotyf() as Notyf
waitingList.value = props.waiting_list
provider.value = props.provider

const toggleAvailability = () => {
    emits('toggleAvailability', provider.value?.id ?? 0)
}
const alertProvider = async () => {
    if (provider.value.id) {
        const { message, success } = await sendAlertToProvider(provider.value.id)
        if (success) {
            notif.success(t('toast.success.provider_alerted'))
        } else {
            notif.error({ message: message, duration: 3000 })
        }
    }
}
const canAlert = computed(() => {
    if (provider.value.is_available && props.current_turn_number) {
        return true
    } else {
        return false
    }
})

</script>

<template>
    <div class="columns is-kanban-wrapper">
        <div class="column">
            <div class="kanban-column" :class="[
                waiting_list.length === 0 && 'is-empty',
            ]">
                <div class="expanded-content">
                    <div class="column-title is-flex is-justify-content-center">
                        <h3>
                            <span class="column-name">{{ provider.user.first_name }} {{
                                provider.user.last_name }}</span>
                            <span class="task-count">{{ waiting_list.length }}</span>
                            <p class="column-name has-text-centered">{{ provider.user.room.department?.name }} #{{
                                provider.user.room.number }} |
                                <span :class="provider.is_available ? 'has-text-success' : 'has-text-danger'">{{
                                    provider.is_available ? t('waiting_list.is_available')
                                    : t('waiting_list.is_not_available') }}</span>
                            </p>
                            <p class="column-name has-text-centered is-size-6 has-text-info">{{
                                t('waiting_list.current_turn_number') }}
                                {{ $props.current_turn_number == undefined ? '-' : $props.current_turn_number }}
                            </p>
                        </h3>
                        <div v-if="$props.withChangeAvailability || $props.withAlertProvider" class="dropdown">
                            <WaitingListDropDown @change-availability="toggleAvailability" @alert-provider="alertProvider"
                                :employee-availability="provider.is_available"
                                :change-availability-permission="Permissions.EMPLOYEE_AVAILABILITY_TOGGLE"
                                :alert-provider-permission="Permissions.EMPLOYEE_AVAILABILITY_TOGGLE"
                                :show-alert="canAlert" />

                        </div>
                    </div>

                    <div>
                        <div v-if="waiting_list.length === 0" class="kanban-empty">
                            <img class="empty-state theme-image light-image"
                                src="/@src/assets/illustrations/projects/board/new.svg" alt="" />
                            <img class="empty-state theme-image dark-image"
                                src="/@src/assets/illustrations/projects/board/new-dark.svg" alt="" />
                            <p class="empty-text">{{ t('waiting_list.no_tickets_place_holder') }}</p>
                        </div>
                        <div v-for="ticket in waiting_list" :key="ticket.ticket.id" :data-id="ticket.ticket.id"
                            class="kanban-card is-new p-2"
                            :class="[ticket.ticket.status == TicketConsts.SERVING && 'ticket-wrapper is-info']">
                            <div class="card-inner ">

                                <h4 class="card-title">
                                    {{ ticket.ticket.customer.user.first_name }} {{
                                        ticket.ticket.customer.user.last_name
                                    }} | {{ t('waiting_list.ticket_id', { ticket_id: ticket.ticket.id }) }}
                                </h4>
                                <p class="column-name is-size-6 has-text-info">{{
                                    t('waiting_list.turn_number') }}
                                    {{ ticket.turn_number }}
                                </p>

                                <p class="column-name">{{ ticket.ticket.created_at }} </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* ==========================================================================
1. Kanban Toolbar
========================================================================== */

.kanban-toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    &.is-navbar {
        padding-top: 30px;
    }

    .avatar-stack {
        margin-left: 16px;
    }

    .button {
        margin-left: auto;
    }
}

/* ==========================================================================
2. Kanban Layout
========================================================================== */

.is-kanban-wrapper {
    position: sticky;
    min-width: 350px;
    height: 100%;
    z-index: 0;

    .column {
        padding: 0.35rem !important;
    }

    .kanban-column {
        min-height: 100%;
        padding: 6px;
        background: #e3e4e5;
        border-radius: 8px;
        border: 1px solid var(--medium-grey);

        .column-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: center;

            h3 {
                margin-bottom: 0;
                font-family: var(--font);
                font-size: 0.85rem;
                font-weight: 500;
                text-transform: uppercase;
                color: var(--light-text-dark-8);
            }

            .dropdown {
                position: absolute;
                top: 5px;
                left: 5px;
            }

            .input {
                margin-right: 20px;
            }

            svg {
                height: 18px;
                width: 18px;
                color: var(--dark-text);
            }

            .task-count {
                padding-left: 4px;

                &::before {
                    content: ' (';
                }

                &::after {
                    content: ') ';
                }
            }

            .dropdown {
                .is-trigger {
                    height: 18px;
                    width: 18px;
                    cursor: pointer;

                    svg {
                        height: 18px;
                        width: 18px;
                        color: var(--light-text-dark-8);
                    }
                }
            }
        }

        .empty-state {
            margin: 30px auto 10px;
            width: 150px;
            height: auto;
        }

        .empty-text {
            text-align: center;
            padding: 10px 10px 20px;
            font-size: 0.95rem;
            color: var(--dark-text);

            span {
                display: block;
            }

            a {
                line-height: 0.9;
                margin-top: 10px;
            }
        }

        .collapsed-content {
            display: none;
        }

        &.is-empty {

            .empty-state,
            .empty-text {
                display: block;
            }
        }

        &.is-collapsed {
            width: 100%;
            height: 500px;
            position: relative;

            .expanded-content {
                display: none;
            }

            .column-title,
            .kanban-card,
            .empty-state,
            .empty-text {
                display: none;
            }

            .collapsed-content {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                .expand-button {
                    margin-top: 20px;
                    height: 46px;
                    width: 46px;
                    background: var(--white);
                    border-radius: var(--radius-rounded);
                    border: 1.4px solid var(--fade-grey);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.3s; // transition-all test
                    cursor: pointer;

                    svg {
                        height: 18px;
                        width: 18px;
                        transition: all 0.3s; // transition-all test
                        color: var(--muted-grey);
                    }

                    &:hover {
                        border-color: var(--primary);

                        svg {
                            color: var(--primary);
                        }
                    }
                }

                .task-count {
                    margin-top: 20px;
                    height: 38px;
                    width: 38px;
                    background: var(--primary);
                    border-radius: var(--radius-rounded);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--smoke-white);
                }

                .collapsed-text {
                    position: absolute;
                    bottom: 160px;
                    min-width: 250px;
                    font-size: 1rem;
                    color: var(--dark-text);
                    font-weight: 600;
                    margin-left: -3px;
                    transform: rotate(-90deg);
                }
            }
        }
    }
}

/* ==========================================================================
3. Kanban Card
========================================================================== */

.kanban-card {
    width: 100%;
    background: var(--white);
    border-radius: var(--radius-large);
    margin-top: 10px;
    border: 1px solid var(--medium-grey);
    transition: all 0.4s;
    display: flex;
    justify-content: center;

    &:hover,
    &:focus {
        box-shadow: 0 5px 43px rgb(0 0 0 / 18%) !important;
    }


    &.ticket-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--radius-large);

        &::after {
            content: '';
            position: absolute;
            top: calc(0);
            left: calc(0);
            height: 100%;
            width: 100%;
            border-radius: var(--radius-large);
            background: var(--white);
            animation: boxShadowWave 1.6s infinite;
            animation-duration: 2s;
            transform-origin: center center;
            z-index: 1;
        }

        .card-body {
            padding: 20px;
            position: relative;
            display: block;
            width: 62px;
            height: 62px;
            border-radius: var(--radius-rounded);
            z-index: 2;

            .kanban-card-stats {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding-top: 16px;

                >span {
                    font-size: 0.9rem;
                    color: var(--light-text);

                    svg {
                        position: relative;
                        top: 2px;
                        height: 14px;
                        width: 14px;
                        stroke-width: 1.6px;
                    }
                }
            }


        }

        .card-inner {
            z-index: 5;
        }


        .card-title {
            font-size: 0.9rem;
            font-family: var(--font-alt);
            font-weight: 600;
            color: var(--dark-text);
        }

        .spaced-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }


        &.is-warning {
            border: 2px solid var(--warning);

            &::after {
                background: var(--warning);
            }
        }

        &.is-primary {
            border: 2px solid var(--primary) !important;

            &::after {
                background: var(--primary);
            }
        }

        &.is-success {
            border: 2px solid var(--success);

            &::after {
                background: var(--success);
            }
        }

        &.is-danger {
            border: 2px solid var(--danger);

            &::after {
                background: var(--danger);
            }
        }

        &.is-info {
            border: 2px solid var(--info);

            &::after {
                box-shadow: 0 2px 20px var(--info) !important;
                opacity: 1;
            }
        }
    }

    .card-body {
        padding: 20px;
        position: relative;
        display: block;
        width: 62px;
        height: 62px;
        border-radius: var(--radius-rounded);
        z-index: 2;

        .kanban-card-stats {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 16px;

            >span {
                font-size: 0.9rem;
                color: var(--light-text);

                svg {
                    position: relative;
                    top: 2px;
                    height: 14px;
                    width: 14px;
                    stroke-width: 1.6px;
                }
            }
        }


    }

    .card-inner {
        z-index: 5;
    }


    .card-title {
        font-size: 0.9rem;
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
    }

    .spaced-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

}

/* ==========================================================================
4. Dragula
========================================================================== */

.can-drag {
    .kanban-card {
        // fallback if grab cursor is unsupported
        cursor: move;
        cursor: grab;
        cursor: grab;
        cursor: grab;

        // (Optional) Apply a "closed-hand" cursor during drag operation.
        &:active {
            cursor: grabbing;
        }
    }
}

.gu-transit {
    cursor: grabbing !important;
}

.gu-mirror {
    position: fixed;
}

/* ==========================================================================
5. Kanban Board Dark mode
========================================================================== */

.is-dark {
    .kanban-column {
        background: var(--dark-sidebar-light-15);
        border-color: var(--dark-sidebar-light-15);

        .collapsed-content {
            .expand-button {
                background: var(--dark-sidebar-light-6) !important;
                border-color: var(--dark-sidebar-light-12) !important;

                &:hover,
                &:focus {
                    svg {
                        color: var(--primary) !important;
                    }
                }
            }

            .task-count {
                background: var(--primary) !important;
                border-color: var(--primary) !important;

                svg {
                    color: var(--white) !important;
                }
            }

            .collapsed-text {
                color: var(--dark-dark-text) !important;
            }
        }

        .column-title {
            h3 {
                color: var(--body-color);
            }

            .is-trigger svg {
                color: var(--body-color) !important;
            }
        }

        .dropdown-content {
            background: var(--dark-sidebar);

            .dropdown-item {
                color: var(--white);
            }

            .dropdown-divider {
                background: var(--dark-sidebar-light-5);
            }

            a:hover,
            div:hover {
                background: var(--dark-sidebar-light-5) !important;
            }
        }

        .empty-text {
            color: var(--primary-grey);
        }

        .kanban-card,
        .gu-transit {
            background: var(--dark-sidebar-light-6) !important;
            border-color: var(--dark-sidebar-light-6) !important;

            &.is-new {
                background: var(--dark-sidebar-light-6);
                border-color: var(--dark-sidebar-light-6);

                .card-title {
                    color: var(--primary-grey-light-2);
                }

                .card-footer,
                .card-footer-item {
                    border-color: var(--dark-sidebar-light-20);
                    color: var(--body-color);
                }
            }

            &.ticket-wrapper {

                &::after {
                    background: var(--dark-sidebar-light-6) !important;
                }

                &.is-warning {
                    border: 2px solid var(--warning) !important;

                    &::after {
                        background: var(--warning) !important;
                    }
                }

                &.is-primary {
                    border: 2px solid var(--primary) !important;

                    &::after {
                        background: var(--primary) !important;
                    }
                }

                &.is-success {
                    border: 2px solid var(--success) !important;

                    &::after {
                        background: var(--success) !important;
                    }
                }

                &.is-danger {
                    border: 2px solid var(--danger) !important;

                    &::after {
                        background: var(--danger) !important;
                    }
                }

                &.is-info {
                    border: 2px solid var(--info) !important;

                    &::after {
                        box-shadow: 0 2px 20px var(--info) !important;
                        opacity: 1;
                    }
                }



            }
        }
    }
}

/* ==========================================================================
6. Media Queries
========================================================================== */

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
    .kanban-column {
        padding: 20px !important;

        .kanban-card {
            .card-body {
                padding: 20px 40px;
            }
        }
    }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) {
    .kanban-content {
        padding: 0 10px !important;
    }

    .is-kanban-wrapper {
        .column {
            padding: 0.15rem !important;
        }
    }

    .kanban-column {
        .empty-state {
            width: 130px !important;
        }

        .empty-text {
            font-size: 0.7rem !important;
        }

        .kanban-card {
            .card-title {
                max-width: 152px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .bounty-meta {
                .due-date {
                    display: none;
                }
            }

            .progress-block {
                margin-top: 8px;

                .spec-count {
                    font-size: 0.5rem;
                }
            }

            .avatar-group img {
                height: 28px;
                width: 28px;
            }

            .done-icon {
                height: 18px;
                width: 18px;

                svg {
                    height: 12px;
                    width: 12px;
                }
            }

            &.is-invitation {
                .invitation-avatar {
                    .avatar-wrapper {
                        width: 58px;
                        height: 58px;

                        .bounty-owner {
                            width: 44px;
                            height: 44px;
                        }

                        .skill-badge {
                            width: 20px;
                            height: 20px;
                        }
                    }
                }

                .card-footer-item {
                    padding: 0.5rem;
                    font-size: 0.7rem;
                }

                .time-left {
                    .time-value {
                        font-size: 0.5rem;
                    }
                }
            }
        }
    }
}
</style>
