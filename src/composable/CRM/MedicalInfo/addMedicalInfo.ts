import { useMedicalInfo } from "/@src/stores/CRM/MedicaInfo/medicalInfoStore";
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo";


export async function addMedicalInfo  (medicalInfoData : MedicalInfo)  {

    const medicalInfo =  useMedicalInfo()
    return await medicalInfo.addMedicalInfoStore(medicalInfoData)
    
    

}