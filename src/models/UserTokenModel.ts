export default class UserTokenModel {
	constructor(
		public id: number,
		public userId: number,
		public refreshToken: string = "",
		public initVector: string = "",
		public expiresDate: string,
		public createdDate?: string,
		public updatedDate?: string,
	) {}
}
