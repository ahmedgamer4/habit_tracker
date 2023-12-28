import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { comparePasswords } from 'src/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateLogin({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Could not find user');

    const isPasswordValid = await comparePasswords(user.password, password);
    console.log(isPasswordValid);
    if (user && isPasswordValid) {
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
      });

      return { user, token };
    }
    throw new BadRequestException('Password is incorrect');
  }
}
