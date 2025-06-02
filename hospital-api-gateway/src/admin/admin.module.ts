import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    JwtModule, 
  ],
  controllers: [AdminController],
  providers: [RolesGuard],
})
export class AdminModule {}