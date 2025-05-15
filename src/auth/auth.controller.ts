import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleUserDTO, loginDTO, RegisterDTO } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() dto: loginDTO) {
    return this.authService.signin(dto);
  }

  @Post('/register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.signup(dto);
  }

  @Post('/google')
  continueWithGoogle(@Body() dto: GoogleUserDTO) {
    return this.authService.googleService(dto);
  }

  @Post('googlenew')
  async googlesLogin(@Body('idToken') idToken: string) {
    const user = await this.authService.verifyGoogleIdToken(idToken);

    // TODO: Find or create user in your DB and issue your own JWT
    return {
      message: 'Login successful',
      user,
    };
  }
}
