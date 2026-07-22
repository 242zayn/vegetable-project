// import { BadRequestException, OnModuleInit } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import bcrypt from 'bcrypt';
// import { Model } from 'mongoose';
// import { User, UserDocument, UserRole } from '../users/schema/user.schema';

// export class SeedServicres implements OnModuleInit {
//   constructor(
//     @InjectModel(User.name)
//     private readonly userModel: Model<UserDocument>,
//   ) {}

//   adminInfo = {
//     email: 'admin@gmail.com',
//     password: '12345678',
//     role: UserRole.ADMIN,
//   };

//   async creteAdmin() {
//     const isAdminExist = await this.userModel.findOne({
//       email: this.adminInfo.email,
//     });

//     console.log('isAdminExist', isAdminExist);

//     if (isAdminExist) {
//       throw new BadRequestException('Admin alredy exist');
//     }
//     const slot = 10;
//     // const
//     const passwordHash = bcrypt.hashSync(this.adminInfo.password, slot);

//     const payload = {
//       email: this.adminInfo.email,
//       role: this.adminInfo.role,
//       password: passwordHash,
//     };

//     await this.userModel.create(payload);
//   }
//   async onModuleInit() {
//     await this.creteAdmin();
//   }
// }
