import { Controller, Get, Req, UseGuards, HttpException } from '@nestjs/common';
import axios from 'axios';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { MicroserviceUrls } from '../config/microservices.config'; // 👈 Importar config

@ApiTags('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'medico')
@Controller('reportes')
export class ReportesController {
  private adminServiceUrl = MicroserviceUrls.adminService; 

  private async forwardRequest(path: string, req: any) {
    try {
      const response = await axios.get(`${this.adminServiceUrl}${path}`, {
        headers: {
          Authorization: req.headers.authorization,
          'Content-Type': 'application/json',
        },
        timeout: 5000, 
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error comunicando con admin-service',
        error.response?.status || 500
      );
    }
  }

  @Get('porcentaje-pacientes')
  porcentajePacientes(@Req() req) {
    return this.forwardRequest('/reportes/porcentaje-pacientes', req);
  }

  @Get('reporte-consultas')
  reporteConsultas(@Req() req) {
    return this.forwardRequest('/reportes/reporte-consultas', req);
  }

  @Get('total-empleados')
  totalEmpleados(@Req() req) {
    return this.forwardRequest('/reportes/total-empleados', req);
  }

  @Get('total-medicos')
  totalMedicos(@Req() req) {
    return this.forwardRequest('/reportes/total-medicos', req);
  }

  @Get('porcentaje-motivos')
  porcentajeMotivos(@Req() req) {
    return this.forwardRequest('/reportes/porcentaje-motivos', req);
  }

  @Get('porcentaje-medicos')
  porcentajeMedicos(@Req() req) {
    return this.forwardRequest('/reportes/porcentaje-medicos', req);
  }
}
