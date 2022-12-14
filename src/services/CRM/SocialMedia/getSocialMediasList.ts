import { useSocialMedia } from "/@src/stores/CRM/SocialMedia/socialMediaStore";
import { SocialMedia  , SocialMediaSearchFilter} from "/@src/utils/api/CRM/SocialMedia";
import { Pagination } from "/@src/utils/response";


export async function getSocialMediasList  (searchFilter : SocialMediaSearchFilter)  {
    const socialMedia =  useSocialMedia()
    await socialMedia.getSocialMediasStore(searchFilter)
    var socialMedias : SocialMedia[] = socialMedia.socialMedias
    var pagination : Pagination = socialMedia.pagination
    return { socialMedias , pagination }
}