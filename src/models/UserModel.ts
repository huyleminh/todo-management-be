export enum UserTypeEnum {
	NORMAL,
	GOOGLE,
}

export enum UserStatusEnum {
	IN_ACTIVE,
	ACTIVE,
}

export default class UserModel {
	constructor(
		public userId: number,
		public userUuid: string,
		public password: string,
		public email: string,
		public firstName: string,
		public lastName: string,
		public userType: number = UserTypeEnum.NORMAL,
		public status: number = UserStatusEnum.ACTIVE,
		public lastLogin?: string,
		public dateOfBirth?: string,
		public createdDate?: string,
		public updatedDate?: string,
	) {}
}
