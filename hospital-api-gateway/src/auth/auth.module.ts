import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    JwtModule, 
  ],
  controllers: [AuthController],
  providers: [RolesGuard],
})
export class AuthModule {}
