declare namespace Express {
  import UserInfo from '../../users/userInfo.interface';
  export interface Request {
    user: UserInfo;
  }
}
