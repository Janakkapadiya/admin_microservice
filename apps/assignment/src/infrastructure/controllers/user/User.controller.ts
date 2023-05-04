import { ApiResponseType, JwtAuthGuard, RoleGuard, Roles } from '@app/shared';
import { Role } from '@app/shared/domain/enums/Roles.enum';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'apps/assignment/src/infrastructure/usecase-proxy/usecases-proxy.module';
import { getUsersUseCases } from 'apps/assignment/src/usecases/user/all.user.usecase';
import { CreateUserUseCase } from 'apps/assignment/src/usecases/user/create.user.usecase';
import { getUserByIdUseCases } from 'apps/assignment/src/usecases/user/getById.user.usecase';
import { UpdateUserPasswordUseCase } from 'apps/assignment/src/usecases/user/update.password.usecase';
import {
  CreateUserDto,
  PlaceOrderDto,
  UpdatePasswordDto,
} from './user-dto-class';
import { UserPresenter } from './user.presenter';

@Controller('user')
@ApiTags('user')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(UserPresenter)
export class UserController {
  constructor(
    @Inject(UsecasesProxyModule.CREATE_USER_USECASES_PROXY)
    private readonly createUserUsecaseProxy: UseCaseProxy<CreateUserUseCase>,
    @Inject(UsecasesProxyModule.GET_USER_BY_ID_USECASES_PROXY)
    private readonly getUserByIdUseCaseProxy: UseCaseProxy<getUserByIdUseCases>,
    @Inject(UsecasesProxyModule.GET_USERS_USECASES_PROXY)
    private readonly getUsersUseCaseProxy: UseCaseProxy<getUsersUseCases>,
    @Inject(UsecasesProxyModule.UPDATE_USER_PASSWORD_USECASES_PROXY)
    private readonly updateUsersPasswordCaseProxy: UseCaseProxy<UpdateUserPasswordUseCase>,
    @Inject('CONSUMER_SERVICE')
    private readonly consumerService: ClientProxy,
  ) {}

  @Post('createByAdmin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  async createUser(@Body() userData: CreateUserDto) {
    const user = await this.createUserUsecaseProxy
      .getInstance()
      .execute(userData);
    return new UserPresenter(user);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  @ApiResponseType(UserPresenter, true)
  async getAllUser() {
    return await this.getUsersUseCaseProxy.getInstance().execute();
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  @ApiResponseType(UserPresenter, true)
  async getUser(@Param('id') id: number) {
    return await this.getUserByIdUseCaseProxy.getInstance().execute(id);
  }

  @Post('updatePassword')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.User, Role.PowerUser, Role.SupportDesk)
  @ApiResponseType(UserPresenter, true)
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const { email, password } = updatePasswordDto;
    await this.updateUsersPasswordCaseProxy
      .getInstance()
      .execute(email, password);
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('placeOrder')
  async placeOrder(@Body() placeOrderDto: PlaceOrderDto) {
    const { itemName, amount } = placeOrderDto;
    return this.consumerService.send(
      {
        cmd: 'placeOrder',
      },
      {
        itemName,
        amount,
      },
    );
  }
}
