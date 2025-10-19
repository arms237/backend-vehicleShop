import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  Request,
  Patch
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserService } from './user.service';
import { RoleName } from '@prisma/client';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: RoleName, @I18n() i18n: I18nContext) {
    return this.userService.updateUserRole(id, role,i18n);
  }

  @Delete('delete/:id')
    async deleteUser(@Param('id') id: string, @I18n() i18n: I18nContext) {
        return this.userService.deleteUser(id,i18n);
    }
}