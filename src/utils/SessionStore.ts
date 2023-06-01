import { SessionData, Store } from "express-session";
import { Op } from "sequelize";
import { Session } from "../db/models";

export interface SessionStoreOptions {
	maxAge?: number;
	allowTouch?: boolean;
}

export default class SessionStore extends Store {
	private allowTouch: boolean;
	private maxAge: number;

	constructor(options?: SessionStoreOptions) {
		super();

		this.allowTouch = options?.allowTouch ?? true;
		this.maxAge = options?.maxAge ?? 86400 * 1000;
	}

	get(
		sid: string,
		callback: (err: any, session?: SessionData | null | undefined) => void
	): void {
		Session.findOne({
			where: { sid },
		})
			.then((session) => {
				if (!session) {
					// not found
					return callback(null, null);
				}

				const now = new Date();
				if (session.expiresAt < now) {
					// expired
					return callback(null, null);
				}

				try {
					const data = JSON.parse(session.data);
					callback(null, data);
				} catch (err) {
					callback(err);
				}
			})
			.catch(callback);
	}

	set(
		sid: string,
		sessionData: SessionData,
		callback?: ((err?: any) => void) | undefined
	): void {
		let expires: Date;
		if (sessionData.cookie.expires) {
			expires = sessionData.cookie.expires;
		} else {
			expires = new Date(Date.now() + this.maxAge);
		}

		const userId = sessionData.passport?.user;
		const data = JSON.stringify(sessionData);

		Session.upsert({
			sid: sid,
			data: data,
			expiresAt: expires,
		})
			.then(async ([session]) => {
				if (userId) await session.setUser(userId);
				callback && callback();
			})
			.catch((err) => {
				callback && callback(err);
			});
	}

	destroy(sid: string, callback?: ((err?: any) => void) | undefined): void {
		Session.destroy({
			where: { sid },
		})
			.then(() => callback && callback())
			.catch(callback);
	}

	all(
		callback: (
			err: any,
			obj?: SessionData[] | { [sid: string]: SessionData } | null | undefined
		) => void
	): void {
		const now = new Date();

		Session.findAll({
			where: {
				expiresAt: {
					[Op.gte]: now,
				},
			},
		})
			.then((sessions) => {
				const sessionDatas: { [sid: string]: SessionData } = {};
				for (const session of sessions) {
					try {
						const data = JSON.parse(session.data);
						sessionDatas[session.sid] = data;
					} catch (err) {
						return callback(err);
					}
				}

				callback(null, sessionDatas);
			})
			.catch(callback);
	}

	length(callback: (err: any, length?: number | undefined) => void): void {
		const now = new Date();

		Session.count({
			where: {
				expiresAt: {
					[Op.gte]: now,
				},
			},
		})
			.then((count) => {
				callback(null, count);
			})
			.catch(callback);
	}

	clear(callback?: ((err?: any) => void) | undefined): void {
		Session.sync({
			force: true,
		})
			.then(() => callback && callback())
			.catch(callback);
	}

	touch(
		sid: string,
		session: SessionData,
		callback?: (() => void) | undefined
	): void {
		if (!this.allowTouch) {
			callback && callback();
			return;
		}

		let expires: Date;
		if (session.cookie.expires) {
			expires = session.cookie.expires;
		} else {
			expires = new Date(Date.now() + this.maxAge);
		}

		Session.update(
			{
				expiresAt: expires,
			},
			{
				where: { sid },
			}
		)
			.then(callback)
			.catch(callback);
	}
}
