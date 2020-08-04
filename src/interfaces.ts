export interface Payload {
    user_id: number;
}

export interface AuthStatus {
	status: string,
	message: string
}

export interface AuthResponse {
	expiresIn?: number,
	token?: string,
	refresh?: string
}

export interface UpdatedTokens {
	expired?: 1 | 2 | 0,
	header?: [string, string],
	cookie?: [string, string, { expires: Date, httpOnly: boolean }]
}