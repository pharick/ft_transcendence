export enum UserStatus {
  Offline = 'Offline',
  Online = 'Online',
  InGame = 'In game',
}

export interface UserStatusInterface {
  status: UserStatus;
}
