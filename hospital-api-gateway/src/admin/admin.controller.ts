import {
  Controller, Get, Post, Body, Param, Put, Delete,
  UseGuards, Req, HttpException, InternalServerErrorException
} from '@nestjs/common';
import axios from 'axios';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MicroserviceUrls } from '../config/microservices.config';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
//  private adminServiceUrl = 'http://172.214.214.220:3000';
//private adminServiceUrl = 'localhost:3005';
private adminServiceUrl = MicroserviceUrls.adminService; 

private getAuthHeader(req): { headers: any } {
    return {
      headers: {
        Authorization: req.headers.authorization,
        'Content-Type': 'application/json',
      },
    };
  }

  private async forwardRequest(method: string, path: string, data: any, req): Promise<any> {
    try {
      const config = this.getAuthHeader(req);
      const axiosConfig = { ...config };

      if (data !== null && data !== undefined) {
        axiosConfig['data'] = data;
      }

      const response = await axios({
        method,
        url: `${this.adminServiceUrl}${path}`,
        ...axiosConfig,
      });
      return response.data;
    } catch (error) {
      if (error.response && (error as any).isAxiosError) {
        throw new HttpException(error.response.data, error.response.status);
      }



      throw new InternalServerErrorException('Error al comunicarse con el microservicio');
    }
  }

  // === MÉDICO ===

  @Delete('medico-completo/:id')
  async deleteMedicoConUsuario(@Param('id') id: string, @Req() req) {
    const config = this.getAuthHeader(req);
  
    try {
      // 1. Eliminar el médico
      const medicoRes = await axios.delete(`${this.adminServiceUrl}/medico/${id}`, config);
  
      // 2. Eliminar el usuario asociado por medico_id
      const authServiceUrl = MicroserviceUrls.authService;
      const usuarioRes = await axios.delete(`${authServiceUrl}/users/medico/${id}`, config);
  
      return {
        message: 'Médico y usuario eliminados correctamente',
        medico: medicoRes.data,
        usuario: usuarioRes.data,
      };
    } catch (error) {
      console.error('Error al eliminar médico y usuario:', error.response?.data || error);
  
      const msg = error.response?.data?.message || 'Error al eliminar médico/usuario';
      throw new HttpException(msg, error.response?.status || 500);
    }
  }
  


  @Post('medico') createMedico(@Body() body, @Req() req) {
    return this.forwardRequest('post', '/medico', body, req);
  }
  @Get('medico') getMedicos(@Req() req) {
    return this.forwardRequest('get', '/medico', null, req);
  }
  @Get('medico/:id') getMedico(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('get', `/medico/${id}`, null, req);
  }
  @Put('medico/:id') updateMedico(@Param('id') id: string, @Body() body, @Req() req) {
    return this.forwardRequest('put', `/medico/${id}`, body, req);
  }
  @Delete('medico/:id') deleteMedico(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('delete', `/medico/${id}`, null, req);
  }

  // === EMPLEADO ===
  @Post('empleado') createEmpleado(@Body() body, @Req() req) {
    return this.forwardRequest('post', '/empleado', body, req);
  }
  @Get('empleado') getEmpleados(@Req() req) {
    return this.forwardRequest('get', '/empleado', null, req);
  }
  @Get('empleado/:id') getEmpleado(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('get', `/empleado/${id}`, null, req);
  }
  @Put('empleado/:id') updateEmpleado(@Param('id') id: string, @Body() body, @Req() req) {
    return this.forwardRequest('put', `/empleado/${id}`, body, req);
  }
  @Delete('empleado/:id') deleteEmpleado(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('delete', `/empleado/${id}`, null, req);
  }

  // === CENTRO MÉDICO ===
  @Post('centro-medico') createCentroMedico(@Body() body, @Req() req) {
    return this.forwardRequest('post', '/centro-medico', body, req);
  }
  @Get('centro-medico') getCentrosMedicos(@Req() req) {
    return this.forwardRequest('get', '/centro-medico', null, req);
  }
  @Get('centro-medico/:id') getCentroMedico(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('get', `/centro-medico/${id}`, null, req);
  }
  @Put('centro-medico/:id') updateCentroMedico(@Param('id') id: string, @Body() body, @Req() req) {
    return this.forwardRequest('put', `/centro-medico/${id}`, body, req);
  }
  @Delete('centro-medico/:id') deleteCentroMedico(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('delete', `/centro-medico/${id}`, null, req);
  }

  // === ESPECIALIDAD ===
  @Post('especialidad') createEspecialidad(@Body() body, @Req() req) {
    return this.forwardRequest('post', '/especialidad', body, req);
  }
  @Get('especialidad') getEspecialidades(@Req() req) {
    return this.forwardRequest('get', '/especialidad', null, req);
  }
  @Get('especialidad/:id') getEspecialidad(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('get', `/especialidad/${id}`, null, req);
  }
  @Put('especialidad/:id') updateEspecialidad(@Param('id') id: string, @Body() body, @Req() req) {
    return this.forwardRequest('put', `/especialidad/${id}`, body, req);
  }
  @Delete('especialidad/:id') deleteEspecialidad(@Param('id') id: string, @Req() req) {
    return this.forwardRequest('delete', `/especialidad/${id}`, null, req);
  }

@Put('usuario/medico/:id')
async updateUsuarioMedico(@Param('id') id: string, @Body() body, @Req() req) {
  const authServiceUrl = MicroserviceUrls.authService;

  const config = this.getAuthHeader(req);

  try {
    const response = await axios.put(`${authServiceUrl}/auth/users/medico/${id}`, body, config);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error.response?.data || error);
    const msg = error.response?.data?.message || 'Error al actualizar usuario';
    throw new HttpException(msg, error.response?.status || 500);
  }
}

  

@Delete('usuario/medico/:id')
async deleteUsuarioMedico(@Param('id') id: string, @Req() req) {
  const config = this.getAuthHeader(req);
  const authServiceUrl = MicroserviceUrls.authService;


  try {
    const response = await axios.delete(`${authServiceUrl}/auth/users/medico/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error.response?.data || error);
    const msg = error.response?.data?.message || 'Error al eliminar usuario';
    throw new HttpException(msg, error.response?.status || 500);
  }
}

@Get('usuario')
getUsuarios(@Req() req) {
  const authServiceUrl = MicroserviceUrls.authService; 
  const config = this.getAuthHeader(req);
  return axios.get(`${authServiceUrl}/users`, config)
    .then(res => res.data)
    .catch(err => {
      console.error('Error al obtener usuarios:', err.response?.data || err);
      const msg = err.response?.data?.message || 'Error al obtener usuarios';
      throw new HttpException(msg, err.response?.status || 500);
    });
}

@Post('auth/register')
async createUsuario(@Body() body, @Req() req) {
  const authServiceUrl = MicroserviceUrls.authService;
  const config = this.getAuthHeader(req);

  try {
    const response = await axios.post(`${authServiceUrl}/auth/register`, body, config);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error.response?.data || error);
    const msg = error.response?.data?.message || 'Error al registrar usuario';
    throw new HttpException(msg, error.response?.status || 500);
  }
}


}
