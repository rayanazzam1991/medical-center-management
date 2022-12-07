export class BaseConsts {
    static readonly ACTIVE = 1
    static readonly INACTIVE = 0
    static readonly TRUE = 1
    static readonly FALSE = 0
    
    public static showStatusName(  status : number): string {
        if (status === BaseConsts.ACTIVE) 
            return 'Active'

        if (status === BaseConsts.INACTIVE) 
            return 'Inactive'
        return ''
    }
    public static showBoolean(  boolean : number): string {
        if (boolean === BaseConsts.TRUE) 
            return 'Yes'

        if (boolean === BaseConsts.FALSE) 
            return 'No'
        return ''
    }
}
