import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConsultaController } from './consulta.controller';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    JwtModule, 
  ],
  controllers: [ConsultaController],
  providers: [RolesGuard],
})
export class ConsultaModule {}