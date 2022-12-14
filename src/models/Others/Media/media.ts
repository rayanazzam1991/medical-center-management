import { BaseConsts } from "/@src/utils/consts/base"

export interface Media {
    id?: number
    model_id : unknown
    model_type: string
    relative_path?: string 
    is_featured?: string  
  }
  class MediaConsts extends BaseConsts {
    static readonly EMPLOYEE_MODEL_ROUTE = "App\\Domain\\Employee\\Entity\\Employee";
    static readonly CONTRACTOR_MODEL_ROUTE = "App\\Domain\\Contractor\\Entity\\Contractor";
    static readonly CUSTOMER_MODEL_ROUTE = "App\\Domain\\CRM\\Entity\\Customer";
    static readonly MEDIA_BASE_URL = 'http://127.0.0.1:8000/storage/';
    
}

export {MediaConsts}