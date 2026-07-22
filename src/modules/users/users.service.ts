import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDTO } from '../auth/dto/register.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { LoginDTO } from '../auth/dto/login.dto';
import { User, UserDocument, UserRole } from './schema/user.schema';

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

    const userInfo = await this.userModel.findOne({ email });

    if (!userInfo) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const compairPassword = await bcrypt.compare(password, userInfo?.password);

    if (!compairPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = {
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
    };
  }

  getMe(email: string) {
    return this.userModel
      .findOne({ email })
      .select('-password -securityQuestion -securityAnswerHash')
      .lean()
      .exec();
  }
  getAllUser() {
    return this.userModel.find({}).lean().exec();
  }
}
