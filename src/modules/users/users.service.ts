import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterDTO } from '../auth/dto/register.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDTO } from '../auth/dto/login.dto';
import { VerifyQuestionDTO } from '../auth/dto/verify-question-dto';
import { User, UserDocument, UserRole } from './schema/user.schema';

export interface PayloadTypes {
  _id: Types.ObjectId;
  email: string;
  role: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(registerData: RegisterDTO) {
    const {
      email,
      name,
      phone,
      role,
      address,
      password,
      securityAnswers,
      securityQuestion,
    } = registerData;

    const userExists = await this.userModel.exists({ email });

    if (role == UserRole.ADMIN) {
      throw new ConflictException('You can not crete admin user direct');
    }

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const slotround = 10;
    const [passwordHash, securityAnswerHash] = await Promise.all([
      bcrypt.hash(password, slotround),
      bcrypt.hash(securityAnswers, slotround),
    ]);

    console.log('userExists', userExists);
    console.log('passwordHash', passwordHash);
    console.log('securityAnswerHash', securityAnswerHash);

    await this.userModel.create({
      name,
      email,
      address,
      phone,
      password: passwordHash,
      securityQuestion,
      securityAnswerHash,
      role,
    });

    return {
      message: 'User registered successfully',
    };
  }

  async login(loginData: LoginDTO) {
    const { email, password } = loginData;

    const userInfo = await this.userModel
      .findOne({ email })
      .select('-password -securityQuestion -securityAnswerHash')
      .lean()
      .exec();

    if (!userInfo) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const compairPassword = await bcrypt.compare(password, userInfo?.password);

    if (!compairPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload: PayloadTypes = {
      _id: userInfo._id,
      email: userInfo.email,
      role: userInfo.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
      },
      // data: userInfo,
    };
  }

  async getMe(email: string) {
    const user = await this.userModel.aggregate([
      {
        $match: { email },
      },
      {
        $project: {
          securityQuestion: 0,
          securityAnswerHash: 0,
          password: 0,
        },
      },
    ]);

    return (user[0] as UserDocument) ?? null;
    // return this.userModel
    //   .findOne({ email })
    //   .select('-password -securityQuestion -securityAnswerHash')
    //   .lean()
    //   .exec();
  }
  getAllUser() {
    return this.userModel.find({}).lean().exec();
  }
  async get_sequrity_question_services(email: string) {
    const user = await this.userModel.findOne({ email });
    // const { securityQuestion } = user;
    const question = user?.securityQuestion;
    console.log('email is', question);
    return {
      question,
    };
  }
  async get_sequrity_question_services_verify(dto: VerifyQuestionDTO) {
    const { email, securityAnswer } = dto;
    const user = await this.userModel.findOne({ email });
    const hashAnswer = user?.securityAnswerHash;
    if (!hashAnswer) {
      throw new UnauthorizedException('you have na sequrity answer');
    }
    const compairAnswer = await bcrypt.compare(securityAnswer, hashAnswer);
    console.log('anser is that', compairAnswer);
    if (!compairAnswer) {
      throw new UnauthorizedException('Security Answer are does not match');
    }
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const refreToken = await this.jwtService.signAsync(payload);
    return {
      message: 'Security answer verified',
      resetToken: refreToken,
    };
  }

  async resetPassword(dto: { token: string; newPassword: string }) {
    console.log('dto', dto);

    const payload = await this.jwtService.verifyAsync<PayloadTypes>(dto.token);
    console.log('payload', payload.email);
    const hashPassword = await bcrypt.hash(dto.newPassword, 10);
    const user = await this.userModel.findOneAndUpdate(
      {
        email: payload.email,
      },
      {
        password: hashPassword,
      },
    );
    return {
      message: 'Password updated successfully',
      data: user,
    };
  }
}
