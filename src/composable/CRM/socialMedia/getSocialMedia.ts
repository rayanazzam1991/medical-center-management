import { useSocialMedia } from "/@src/stores/CRM/SocialMedia/socialMediaStore";


export async function getSocialMedia  (socialMediaId : number)  {
    const socialMedia =  useSocialMedia()
    return await socialMedia.getSocialMediaStore(socialMediaId)
    

}