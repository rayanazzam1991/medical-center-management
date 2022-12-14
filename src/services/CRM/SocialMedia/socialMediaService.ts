import { SocialMedia, SocialMediaSearchFilter } from "/@src/models/CRM/SocialMedia/socialMedia"
import { useSocialMedia } from "/@src/stores/CRM/SocialMedia/socialMediaStore"
import { Pagination } from "/@src/utils/response"


export async function addSocialMedia  (socialMediaData : SocialMedia)  {
    const socialMedia =  useSocialMedia()
    return await socialMedia.addSocialMediaStore(socialMediaData)
}

export async function deleteSocialMedia  (socialMediaId : number)  {
    const socialMedia =  useSocialMedia()
    await socialMedia.deleteSocialMediaStore(socialMediaId)
}

export async function editSocialMedia  (socialMediaData : SocialMedia)  {
    const socialMedia =  useSocialMedia()
    await socialMedia.editSocialMediaStore(socialMediaData)
}

export async function getSocialMedia  (socialMediaId : number)  {
    const socialMedia =  useSocialMedia()
    return await socialMedia.getSocialMediaStore(socialMediaId)
}

export async function getSocialMediasList  (searchFilter : SocialMediaSearchFilter)  {
    const socialMedia =  useSocialMedia()
    await socialMedia.getSocialMediasStore(searchFilter)
    var socialMedias : SocialMedia[] = socialMedia.socialMedias
    var pagination : Pagination = socialMedia.pagination
    return { socialMedias , pagination }
}