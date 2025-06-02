import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ConsultaModule } from './consulta/consulta.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    AuthModule,AdminModule,ConsultaModule, ReportesModule,
  ],
  providers: [
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AppModule {}