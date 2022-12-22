import { defaultSocialMedia, SocialMedia, SocialMediaSearchFilter } from "/@src/models/CRM/SocialMedia/socialMedia"
import { useSocialMedia } from "/@src/stores/CRM/SocialMedia/socialMediaStore"
import { Pagination } from "/@src/utils/response"


export async function addSocialMedia(socialMediaData: SocialMedia) {
    const socialMediaResponse = useSocialMedia()
    var socialMedia: SocialMedia = await socialMediaResponse.addSocialMediaStore(socialMediaData) ?? defaultSocialMedia
    var success: boolean = socialMediaResponse.success ?? false
    var error_code: string = socialMediaResponse.error_code ?? ''
    var message: string = socialMediaResponse.message ?? ''
    return { success, error_code, message, socialMedia }


}

export async function deleteSocialMedia(socialMediaId: number) {
    const socialMediaResponse = useSocialMedia()
    await socialMediaResponse.deleteSocialMediaStore(socialMediaId)
    var success: boolean = socialMediaResponse.success ?? false
    var error_code: string = socialMediaResponse.error_code ?? ''
    var message: string = socialMediaResponse.message ?? ''
    return { success, error_code, message }

}

export async function editSocialMedia(socialMediaData: SocialMedia) {
    const socialMediaResponse = useSocialMedia()
    await socialMediaResponse.editSocialMediaStore(socialMediaData)

    var success: boolean = socialMediaResponse.success ?? false
    var error_code: string = socialMediaResponse.error_code ?? ''
    var message: string = socialMediaResponse.message ?? ''
    return { success, error_code, message }

}

export async function getSocialMedia(socialMediaId: number) {
    const socialMediaResponse = useSocialMedia()
    var socialMedia: SocialMedia = await socialMediaResponse.getSocialMediaStore(socialMediaId) ?? defaultSocialMedia
    var success: boolean = socialMediaResponse.success ?? false
    var error_code: string = socialMediaResponse.error_code ?? ''
    var message: string = socialMediaResponse.message ?? ''
    return { success, error_code, message, socialMedia }

}

export async function getSocialMediasList(searchFilter: SocialMediaSearchFilter) {
    const socialMediaResponse = useSocialMedia()
    await socialMediaResponse.getSocialMediasStore(searchFilter)
    var socialMedias: SocialMedia[] = socialMediaResponse.socialMedias
    var success: boolean = socialMediaResponse.success ?? false
    var error_code: string = socialMediaResponse.error_code ?? ''
    var message: string = socialMediaResponse.message ?? ''
    var pagination: Pagination = socialMediaResponse.pagination

    return { success, error_code, message, socialMedias, pagination }

}