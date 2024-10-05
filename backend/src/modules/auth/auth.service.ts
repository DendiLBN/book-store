import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/users.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { hashData } from 'src/common/utils/hash-data.utils';

import * as bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { nanoid } from 'nanoid';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ firstName: string; email: string }> {
    const isUserExists = await this.usersService.getUserByEmail(
      createUserDto.email,
    );
    if (isUserExists) throw new BadRequestException('Email occupied');

    const hashedPsssword = await hashData(createUserDto.password);
    createUserDto.password = hashedPsssword;

    const newUser = await this.usersService.createUser(createUserDto);

    return {
      firstName: newUser.firstName,
      email: newUser.email,
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.getUserById(userId);
    console.log('User data:', user);

    if (!user) {
      throw new NotFoundException('User not found...');
    }

    if (!oldPassword || !user.password) {
      throw new UnauthorizedException(
        'Old password or user password is missing...',
      );
    }

    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect password...');
    }

    const hashedPassword = await hashData(newPassword);
    user.password = hashedPassword;
    await this.usersService.update(userId, user);
    return {
      message: `Password has been changed '${oldPassword}' for'${newPassword}'`,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (!user) throw new NotFoundException();

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatches) throw new UnauthorizedException();

    const tokens = await this.getTokens(user._id);

    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found in system');
    }

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const resetToken = nanoid(64);

    await this.usersService.update(user._id, {
      resetToken,
      resetTokenExpiry: expiryDate,
    });

    await this.mailService.nodeMailSendPassword(email, resetToken);

    return {
      message:
        'Reset password email sent successfully, check your email and follow how to reset password',
    };
  }
  // NOTE Reset password email & forgot password

  async sendResetPasswordEmail(email: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found in system');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.getUserByResetToken(token);

    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    if (user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return { message: 'Password has been reset successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user._id);

    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null });
    return true;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async getTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { id: userId },
          {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_LIFETIME'),
          },
        ),
        this.jwtService.signAsync(
          { id: userId },
          {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_LIFETIME'),
          },
        ),
      ]);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Token generation failed');
    }
  }
}
