// 认证相关类型

export interface UserInfo {
    id: number;
    profilePic: string;
    phone: string;
    nickname: string;
    name: string;
    username: string;
    /** Y-可用  N-禁用 */
    status: 'Y' | 'N';
}

/** /api/user/getInfo 接口 data 字段完整结构 */
export interface GetInfoData {
    user: UserInfo;
}
