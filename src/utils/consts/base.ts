export class BaseConsts {
    static readonly ACTIVE = 1
    static readonly INACTIVE = 0
    public static showStatusName(  status : number): string {
        if (status === BaseConsts.ACTIVE) 
            return 'Active'

        if (status === BaseConsts.INACTIVE) 
            return 'Inactive'
        return ''
    }
}
