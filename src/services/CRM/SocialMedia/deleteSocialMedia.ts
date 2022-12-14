import { useSocialMedia } from "/@src/stores/CRM/SocialMedia/socialMediaStore";


export async function deleteSocialMedia  (socialMediaId : number)  {
    const socialMedia =  useSocialMedia()
    await socialMedia.deleteSocialMediaStore(socialMediaId)
}