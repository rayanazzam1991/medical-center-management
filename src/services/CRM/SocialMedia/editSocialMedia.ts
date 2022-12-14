import { useSocialMedia } from "/@src/stores/CRM/SocialMedia/socialMediaStore";
import { SocialMedia } from "/@src/utils/api/CRM/SocialMedia";


export async function editSocialMedia  (socialMediaData : SocialMedia)  {
    const socialMedia =  useSocialMedia()
    await socialMedia.editSocialMediaStore(socialMediaData)
}