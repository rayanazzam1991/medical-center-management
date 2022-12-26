import { string } from "zod"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Media {
  id?: number
  model_id: unknown
  model_type: string
  relative_path?: string
  is_featured?: string
  file_name?: string
  mime_type?: string
  size?: number
  created_at?: string
}
class MediaConsts extends BaseConsts {
  static readonly EMPLOYEE_MODEL_ROUTE = "App\\Domain\\Employee\\Entity\\Employee";
  static readonly CONTRACTOR_MODEL_ROUTE = "App\\Domain\\Contractor\\Entity\\Contractor";
  static readonly CUSTOMER_MODEL_ROUTE = "App\\Domain\\CRM\\Entity\\Customer";
  static readonly MEDICAL_INFO_ROUTE = "App\\Domain\\CRM\\Entity\\Medical_info";
  static readonly MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;

  public static getMediaIcon(mime_type: string): string {

    if (mime_type.startsWith('image'))
      return '/images/icons/files/image.png'
    if (mime_type == 'text/csv')
      return '/images/icons/files/excel.png'
    if (mime_type == 'application/msword' || mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      return '/images/icons/files/word.png'
    if (mime_type == 'application/pdf')
      return '/images/icons/files/pdf.png'
    if (mime_type == 'text/plain')
      return '/images/icons/files/txt.png'

    return '/images/icons/files/unknown.png'
  }

  public static getAvatarIcon(gender: string): string {

    if (gender === 'Male')
      return '/images/icons/avatar/man.png'
    if (gender === 'Female')
      return '/images/icons/avatar/woman.png'
    else
      return '/images/icons/files/not_selected.png'
  }

}
export { MediaConsts }
