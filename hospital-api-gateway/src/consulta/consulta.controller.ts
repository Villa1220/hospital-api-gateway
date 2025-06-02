import {
  Controller, Get, Post, Body, Param, Put, Delete,
  UseGuards, Req, HttpException, InternalServerErrorException
} from '@nestjs/common';
import axios from 'axios';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MicroserviceUrls } from '../config/microservices.config';

@Controller('consulta')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('medico')
export class ConsultaController {
  private consultaServiceUrl = MicroserviceUrls.consultaService;

  private getAuthHeader(req): { headers: any } {
    return {
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json',
      },
    };
  }

  private async forwardRequest(
    method: string,
    path: string,
    data: any,
    req,
    customBaseUrl?: string
  ): Promise<any> {
    const config = this.getAuthHeader(req);
    const baseUrl = customBaseUrl || this.consultaServiceUrl;

    const options = {
      method,
      url: `${baseUrl}${path}`,
      timeout: 5000,
      ...config,
      validateStatus: (status: number) => true,
    };

    if (data) {
      (options as any).data = data;
    }

    const maxRetries = 2;
    let attempt = 0;
    let lastError: any = null;

    while (attempt <= maxRetries) {
      try {
        const response = await axios(options);

        if (response.status >= 400) {
          throw new HttpException(response.data || { message: 'Error inesperado' }, response.status);
        }

        return response.data;
      } catch (error) {
        lastError = error;
        console.error(` Error en intento ${attempt + 1}:`, error.message);

        if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED' || error.message.includes('timeout')) {
          attempt++;
          if (attempt > maxRetries) {
            break;
          }
          console.log(` Reintentando (${attempt}/${maxRetries})...`);
        } else {
          throw error;
        }
      }
    }

    console.error(' Error final en forwardRequest después de reintentos:', lastError.message);
    throw new InternalServerErrorException('Error al comunicarse con el microservicio después de varios intentos');
  }

  @Get('especialidades')
  async getEspecialidades(@Req() req) {
    const token = req.headers.authorization;

    const response = await axios.get(`${MicroserviceUrls.adminService}/especialidad`, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
      validateStatus: () => true,
    });

    if (response.status >= 400) {
      throw new HttpException(response.data || { message: 'Error inesperado' }, response.status);
    }

    return response.data;
  }

  // ==== CRUD de consultas ====

  @Post()
  create(@Body() body: any, @Req() req) {
    return this.forwardRequest('post', '/consulta-medica', body, req);
  }

  @Get()
  findAll(@Req() req) {
    return this.forwardRequest('get', '/consulta-medica', null, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('get', `/consulta-medica/${id}`, null, req);
  }

  @Get('medico/:medico_id')
  findOneById_Medico(@Param('medico_id') id: string, @Req() req) {
    return this.forwardRequest('get', `/consulta-medica/medico/${id}`, null, req);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req) {
    return this.forwardRequest('put', `/consulta-medica/${id}`, body, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('delete', `/consulta-medica/${id}`, null, req);
  }
}
