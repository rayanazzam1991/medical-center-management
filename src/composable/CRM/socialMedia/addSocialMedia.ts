import { useSocialMedia } from "/@src/stores/CRM/SocialMedia/socialMediaStore";
import { SocialMedia } from "/@src/utils/api/CRM/SocialMedia";


export async function addSocialMedia  (socialMediaData : SocialMedia)  {

    const socialMedia =  useSocialMedia()
    return await socialMedia.addSocialMediaStore(socialMediaData)
    
    

}