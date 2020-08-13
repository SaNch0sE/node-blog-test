export interface IPayload {
  user_id: number;
}

export interface IAuthStatus {
  status: string;
  message: string;
}

export interface IAuthResponse {
  expiresIn?: number;
  token?: string;
  refresh?: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IUpdatedTokens {
  expired?: 1 | 2 | 0;
  header?: [string, string];
  cookie?: [string, string, { expires: Date; httpOnly: boolean }];
}
