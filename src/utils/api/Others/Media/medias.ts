import { AxiosInstance } from "axios";
import { Media } from "/@src/models/Others/Media/media";
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response";


export async function uploadMediaApi(
  api: AxiosInstance,
  media : FormData
  ): Promise<{ response: CustomResponseCollection;  }> {
    
  const { data: response } = await api.post(
    `media/uploadFiles` , media ,    {
      headers: {
        'Accept': 'multipart/form-data',
        'Content-Type': 'multipart/form-data',
    }
    }
  )
  return { response }
}

export async function getMediaApi(
  api: AxiosInstance,
  media : Media
  
  ): Promise<{ response: CustomResponseCollection;  }> {

  const { data: response } = await api.get(
    `media/getFiles` ,  {
      params : media    }
  )
  return { response }
}
export async function deleteMediaApi(
  api: AxiosInstance,
  media_id : number
  
  ): Promise<{ response: CustomResponseSingle;  }> {

  const { data: response } = await api.delete(
    `media/deleteFile/${media_id}`)
    console.log(response)
  return { response }
}
