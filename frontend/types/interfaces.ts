export interface User {
  id: number;
  ecole42Id: number;
  username: string;
  avatar: string;
  rank: number;
  prevRank: number;
}

export interface Player {
  id: number;
  username: string;
  avatar: string;
  rank?: number;
  prevRank?: number;
}

export interface Game {
  id: string;
  fieldWidth: number;
  fieldHeight: number;
  player1: Player;
  player2: Player;
  score1: number;
  score2: number;
  durationMs: number;
  status: GameStatus;
  isRanked: boolean;
  isTraining: boolean;
}

export enum GameStatus {
  Player1Serve,
  Player2Serve,
  OnGame,
}

export interface GameFrame {
  ballRadius: number;
  ballX: number;
  ballY: number;
  clubWidth: number;
  clubHeightLeft: number;
  clubHeightRight: number;
  club1Pos: number;
  club2Pos: number;
  score1: number;
  score2: number;
  status: GameStatus;
  durationMs: number;
  isCompleted: boolean;
  wallWidth: number[];
  wallHeight: number[];
  wallPos: number[];
}

export interface GameClients {
  watchers: Player[];
  player1online: boolean;
  player2online: boolean;
}

export interface CompletedGame {
  id: number;
  date: Date;
  score1: number;
  score2: number;
  duration: number;
  player1: User;
  player2: User;
  isRanked: boolean;
}

export interface PendingGame {
  id: number;
  player1: User;
  player2: User;
}

export interface Notifications {
  games: Game[];
  pending: PendingGame[];
}

export enum UserStatus {
  Offline = 'Offline',
  Online = 'Online',
  InGame = 'In game',
}

export interface UserStatusInterface {
  status: UserStatus;
}

export enum ChatRoomType {
  Public,
  Private,
  Protected,
}

export interface ChatRoom {
  id: number;
  name: string;
  type: ChatRoomType;
  password?: string;
  users: ChatRoomUser[];
}

export interface ChatMessage {
  id: number;
  date: Date;
  user: User;
  room: ChatRoom;
  text: string;
}

export enum ChatRoomUserType {
  Owner,
  Admin,
  Common,
}

export interface ChatRoomUser {
  id: number;
  user: User;
  type: ChatRoomUserType;
  bannedUntil: Date;
  mutedUntil: Date;
  isOnline: boolean;
}
