import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../aplication/services/auth.service';
import { LoginDto } from '../aplication/dtos/login.dto';
import { AuthResponseDto } from '../aplication/dtos/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Successful login', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        // Aquí debes validar las credenciales del usuario (esto es solo un ejemplo)
        const user = { userId: 1, username: loginDto.username };
        return this.authService.login(user);
    }
}
