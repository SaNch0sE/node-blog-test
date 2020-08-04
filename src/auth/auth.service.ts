import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDTO } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { AuthStatus, AuthResponse, Payload, UpdatedTokens } from 'src/interfaces';
import { Request } from 'express';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) { }

	async register(user: UserDTO): Promise<AuthStatus> {
		const status: AuthStatus = {
			status: 'Success',
			message: 'No errors'
		}
		try {
			await this.userService.createUser(user);
		} catch (err) {
			status.status = 'Error';
			status.message = err;
		}
		return status;
	}

	createToken(user: UserDTO): AuthResponse {
		const token = jwt.sign(
			{
				user_id: user.id
			},
			process.env.KEY,
			{ expiresIn: process.env.ACCESS_EXPIRES },
		);
		return { token };
	}

	createRefresh(user: UserDTO): AuthResponse {
		const refresh = jwt.sign(
			{
				user_id: user.id
			},
			process.env.KEY,
			{ expiresIn: process.env.REFRESH_EXPIRES },
		);
		return { refresh };
	}

	updateToken(req: Request): UpdatedTokens {
		let status = false;
		const resp: UpdatedTokens = {};
		resp.expired = 0;
		// Checking access token
		try {
			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, process.env.KEY);
			status = true;
		} catch (err) {
			Logger.error('Access token expired', err, 'BlogController', true);
		}
		if (status) {
			Logger.log(`Request -> ${req.path}`, 'BlogController', true);
			resp.expired = 2;
			return resp;
		} else {
			Logger.log(`Trying to create new token`, 'BlogController', true);
			let decoded: any;
			try {
				decoded = jwt.verify(req.cookies.refresh, process.env.KEY);
				status = true;
			} catch (err) {
				Logger.error('Refresh token expired', err, 'BlogController', true);
			}
			// Checking refresh token
			if (status) {
				const access = jwt.sign(
					{ user_id: decoded.user_id },
					process.env.KEY,
					{ expiresIn: process.env.ACCESS_EXPIRES }
				);
				resp.header = ['Authorization', `Bearer ${access}`];
				resp.cookie = [
					'refresh',
					jwt.sign(
						{ user_id: decoded.user_id },
						process.env.KEY,
						{ expiresIn: process.env.REFRESH_EXPIRES }
					),
					{ expires: new Date(Date.now() + 7200000), httpOnly: true }
				];
				resp.expired = 1;
				Logger.log(`Creating of access token -> Successful`, 'BlogController', true);
				return resp;
			}
		}
	}

	async validateUserToken(payload: Payload): Promise<UserDTO> {
		return await this.userService.getUserById(payload.user_id);
	}

	async validateUser(body: UserDTO): Promise<AuthStatus | null> {
		const user = await this.userService.getUser(body);
		if (user && bcrypt.compareSync(body.password, user.password)) {
			return {
				status: 'Success',
				message: 'No errors'
			};
		}
	}
}
