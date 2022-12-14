<script setup lang="ts">import { useHead } from '@vueuse/head';
import { defaultSocialMedia } from '/@src/models/CRM/SocialMedia/socialMedia';
import { getSocialMedia } from '/@src/services/CRM/SocialMedia/socialMediaService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { SocialMediaConsts } from '/@src/models/CRM/SocialMedia/socialMedia';

const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Social Media')
const head = useHead({
    title: 'Social Media',
})



const socialMediaId = ref(0)
// @ts-ignore
socialMediaId.value = route.params?.id as number ?? 0
const currentSocialMedia = ref(defaultSocialMedia)
const getCurrentSocialMedia = async () => {
    const city = await getSocialMedia(socialMediaId.value)
    if (city != undefined)
        currentSocialMedia.value = city
    pageTitle.value = viewWrapper.pageTitle + ': ' + currentSocialMedia.value.name

}
onMounted(async () => {
    await getCurrentSocialMedia()
})

const toEdit = () => {
    router.push({ path: `/social-media/${socialMediaId.value}/edit` })
}

</script>

<template>
    <FormHeader :title="pageTitle" :form_submit_name="'Edit'" :back_route="'/social-media'" @onSubmit="toEdit" />
    <section class="form-layout">
        <div class="form-outer">
            <div class="form-body">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Name:</h4>
                            <span>{{ currentSocialMedia.name }}</span>
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Icon:</h4>
                            <VIcon :icon="currentSocialMedia.icon" />
                        </div>
                        <div class="column is-12">
                            <h4 class="margin-bottom">{{ viewWrapper.pageTitle }} Status:</h4>
                            <span>
                                <VTag
                                    :color="currentSocialMedia.status === SocialMediaConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ SocialMediaConsts.showStatusName(currentSocialMedia.status) }}</VTag>
                            </span>
                        </div>
                    </div>
                </div>
                <!--Fieldset-->
            </div>
        </div>
    </section>


</template>

<style scoped lang="scss">
@import '/@src/scss/abstracts/all';

.is-navbar {
    .project-details {
        padding-top: 30px;
    }
}

.form-body {
    width: 100%;
}

.form-fieldset {
    margin: 0 30px;
}

.margin-bottom {
    margin-bottom: 0.75rem;
}

.project-details {
    .tabs-wrapper {
        .tabs-inner {
            .tabs {
                margin: 0 auto;
                background: var(--white);
            }
        }
    }

    .project-details-inner {
        padding: 20px 0;

        .project-details-card {
            @include vuero-s-card;

            padding: 40px;

            .card-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;

                .title-wrap {
                    h3 {
                        font-family: var(--font-alt);
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: var(--dark-text);
                        line-height: 1.2;
                        transition: all 0.3s; // transition-all test
                    }
                }
            }

            .project-overview {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 0;

                p {
                    max-width: 420px;
                }
            }

            .project-features {
                display: flex;
                padding: 25px 0;
                border-top: 1px solid var(--fade-grey-dark-3);
                border-bottom: 1px solid var(--fade-grey-dark-3);

                .project-feature {
                    margin-right: 20px;
                    width: calc(25% - 20px);

                    i {
                        font-size: 1.6rem;
                        color: var(--primary);
                        margin-bottom: 8px;
                    }

                    h4 {
                        font-family: var(--font-alt);
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: var(--dark);
                    }

                    p {
                        line-height: 1.2;
                        font-size: 0.85rem;
                        color: var(--light-text);
                        margin-bottom: 0;
                    }
                }
            }

            .project-files {
                padding: 20px 0;

                h4 {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    color: var(--primary);
                    margin-bottom: 12px;
                }

                .file-box {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    background: var(--white);
                    border: 1px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s; // transition-all test

                    &:hover {
                        border-color: var(--fade-grey-dark-3);
                        box-shadow: var(--light-box-shadow);
                    }

                    img {
                        display: block;
                        width: 48px;
                        min-width: 48px;
                        height: 48px;
                    }

                    .meta {
                        margin-left: 12px;
                        line-height: 1.3;

                        span {
                            display: block;

                            &:first-child {
                                font-family: var(--font-alt);
                                font-size: 0.9rem;
                                font-weight: 600;
                                color: var(--dark-text);
                            }

                            &:nth-child(2) {
                                font-size: 0.9rem;
                                color: var(--light-text);

                                i {
                                    position: relative;
                                    top: -3px;
                                    font-size: 0.3rem;
                                    color: var(--light-text);
                                    margin: 0 4px;
                                }
                            }
                        }
                    }

                    .dropdown {
                        margin-left: auto;
                    }
                }
            }
        }

        .side-card {
            @include vuero-s-card;

            padding: 40px;
            margin-bottom: 1.5rem;

            h4 {
                font-family: var(--font-alt);
                font-weight: 600;
                font-size: 0.8rem;
                text-transform: uppercase;
                color: var(--primary);
                margin-bottom: 16px;
            }
        }

        .project-team-card {
            @include vuero-s-card;

            padding: 40px;
            max-width: 940px;
            display: block;
            margin: 0 auto;

            .column {
                padding: 1.5rem;

                &:nth-child(odd) {
                    border-right: 1px solid var(--fade-grey-dark-3);
                }

                &.has-border-bottom {
                    border-bottom: 1px solid var(--fade-grey-dark-3);
                }
            }
        }

        .task-grid {
            .grid-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;

                h3 {
                    font-family: var(--font-alt);
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--dark-text);
                    line-height: 1.2;
                }

                .filter {
                    display: flex;
                    align-items: center;
                    background: var(--white);
                    padding: 8px 24px;
                    border-radius: 100px;

                    >span {
                        font-family: var(--font-alt);
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: var(--dark-text);
                        margin-right: 20px;
                    }

                    .multiselect {
                        min-width: 140px;

                        .multiselect-input {
                            border: none;
                        }
                    }
                }
            }

            .task-card {
                @include vuero-s-card;

                min-height: 200px;
                display: flex !important;
                flex-direction: column;
                justify-content: space-between;
                padding: 30px;
                cursor: pointer;
                transition: all 0.3s; // transition-all test

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--light-box-shadow);
                }

                .title-wrap {
                    h3 {
                        font-size: 1.1rem;
                        font-family: var(--font-alt);
                        font-weight: 600;
                        color: var(--dark-text);
                        line-height: 1.2;
                        margin-bottom: 4px;
                    }

                    span {
                        font-family: var(--font);
                        font-size: 0.9rem;
                        color: var(--light-text);
                    }
                }

                .content-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .left {
                        .avatar-stack {
                            margin-bottom: 6px;
                        }

                        .attachments {
                            display: flex;
                            align-items: center;

                            i {
                                font-size: 15px;
                                color: var(--light-text);
                            }

                            span {
                                margin-left: 2px;
                                font-size: 0.9rem;
                                font-family: var(--font);
                                color: var(--light-text);
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .project-details {
        .project-details-inner {
            .project-details-card {
                @include vuero-card--dark;

                .card-head {
                    .title-wrap {
                        h3 {
                            color: var(--dark-dark-text) !important;
                        }
                    }
                }

                .project-features {
                    border-color: var(--dark-sidebar-light-12);

                    .project-feature {
                        i {
                            color: var(--primary);
                        }

                        h4 {
                            color: var(--dark-dark-text);
                        }
                    }
                }

                .project-files {
                    h4 {
                        color: var(--primary);
                    }

                    .file-box {
                        background: var(--dark-sidebar-light-3);

                        &:hover,
                        &:focus {
                            border-color: var(--dark-sidebar-light-10);
                        }

                        .meta {
                            span {
                                &:first-child {
                                    color: var(--dark-dark-text);
                                }
                            }
                        }
                    }
                }
            }

            .side-card {
                @include vuero-card--dark;

                h4 {
                    color: var(--primary);
                }
            }

            .project-team-card {
                @include vuero-card--dark;

                .column {
                    border-color: var(--dark-sidebar-light-12);
                }
            }

            .task-grid {
                .grid-header {
                    h3 {
                        color: var(--dark-dark-text);
                    }

                    .filter {
                        background: var(--dark-sidebar-light-1) !important;
                        border-color: var(--dark-sidebar-light-4) !important;

                        >span {
                            color: var(--dark-dark-text);
                        }
                    }
                }

                .task-card {
                    @include vuero-card--dark;

                    .title-wrap {
                        h3 {
                            color: var(--dark-dark-text);
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .project-details {
        .project-details-inner {
            .project-details-card {
                padding: 30px;

                .project-overview {
                    flex-direction: column;

                    p {
                        margin-bottom: 20px;
                    }
                }

                .project-features {
                    flex-wrap: wrap;

                    .project-feature {
                        width: calc(50% - 20px);
                        text-align: center;
                        margin: 0 10px;

                        &:first-child,
                        &:nth-child(2) {
                            margin-bottom: 20px;
                        }
                    }
                }
            }

            .project-team-card {
                padding: 30px;

                .column {
                    border-right: none !important;
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .project-details {
        .project-details-inner {
            .project-details-card {
                .project-files {
                    .columns {
                        display: flex;

                        .column {
                            min-width: 50%;
                        }
                    }
                }
            }

            .project-team-card {
                .columns {
                    display: flex;

                    .column {
                        min-width: 50%;
                    }
                }
            }

            .task-grid {
                .columns {
                    display: flex;

                    .column {
                        min-width: 50%;
                    }
                }
            }
        }
    }
}
</style>
