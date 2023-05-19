// import { IEmailService, IException } from '@app/shared';
// import { IBcryptService } from 'apps/auth/src/domain/adepters/bcrypt.interface';
// import { beforeAll, describe, expect, it, vi } from 'vitest';
// import { UserRepository } from './domain/interface/UserRepository';
// import { UserM } from './domain/model/UserM';
// import { getUsersUseCases } from './usecases/user/all.user.usecase';
// import { CreateUserUseCase } from './usecases/user/create.user.usecase';
// import { getUserByEmailUseCases } from './usecases/user/getByEmail.usecase';
// import { UpdateUserPasswordUseCase } from './usecases/user/update.password.usecase';

// describe('/apps/assignment/src/usecases/user', () => {
//   let getAllUsersUseCases: getUsersUseCases;
//   let createUserUseCase: CreateUserUseCase;
//   let getByEmailUseCase: getUserByEmailUseCases;
//   let updateUserPasswordUseCase: UpdateUserPasswordUseCase;

//   let userRepository: UserRepository;
//   let exception: IException;
//   let email: IEmailService;
//   let bcrypt: IBcryptService;

//   beforeAll(async () => {
//     userRepository = {} as UserRepository;
//     userRepository.findByEmail = vi.fn();
//     userRepository.findAll = vi.fn();
//     userRepository.createUser = vi.fn();
//     userRepository.resetPassword = vi.fn();

//     exception = {} as IException;
//     exception.UnauthorizedException = vi.fn();
//     exception.badRequestException = vi.fn();
//     exception.forbiddenException = vi.fn().mockImplementation((params) => {
//       throw new Error(params.message);
//     });
//     exception.internalServerErrorException = vi.fn();

//     email = {} as IEmailService;
//     email.sendEmail = vi.fn();

//     bcrypt = {} as IBcryptService;
//     bcrypt.hash = vi.fn();

//     getAllUsersUseCases = new getUsersUseCases(userRepository);
//     createUserUseCase = new CreateUserUseCase(userRepository, exception, email);
//     getByEmailUseCase = new getUserByEmailUseCases(userRepository, exception);
//     updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
//       userRepository,
//       exception,
//       bcrypt,
//     );
//   });

//   describe('get all users', () => {
//     it('should return all users', async () => {
//       const users: UserM[] = [
//         {
//           id: 1,
//           name: 'John',
//           role: null,
//           email: 'email',
//           password: 'password',
//         },
//         {
//           id: 2,
//           name: 'Joh',
//           role: null,
//           email: 'email1',
//           password: 'password1',
//         },
//       ];

//       it('should call userRepository.findAll() once', async () => {
//         await getAllUsersUseCases.execute();
//         expect(userRepository.findAll).toHaveBeenCalledTimes(1);
//       });

//       (userRepository.findAll as jest.Mock).mockResolvedValue(
//         Promise.resolve(users),
//       );

//       expect(await getAllUsersUseCases.execute()).toEqual(users);
//     });
//   });

//   describe('create user', () => {
//     it('should create user', async () => {
//       const user: UserM = {
//         id: 1,
//         name: 'John',
//         role: null,
//         email: 'email',
//         password: 'password',
//       };

//       (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
//       (userRepository.createUser as jest.Mock).mockResolvedValue(
//         Promise.resolve(user),
//       );

//       const result = await createUserUseCase.execute(user);

//       expect(email.sendEmail).toHaveBeenCalledWith(
//         user.email,
//         'please change your password',
//         `hey ${user.name} please change to your new custom password`,
//       );
//       expect(userRepository.createUser).toHaveBeenCalledWith(user);
//       expect(result).toEqual(user);
//     });

//     it('should throw a ForbiddenException if user with email already exists', async () => {
//       const user: UserM = {
//         id: 1,
//         name: 'John',
//         role: null,
//         email: 'john@example.com',
//         password: 'password',
//       };
//       const existingUser: UserM = {
//         id: 2,
//         name: 'Jane',
//         role: null,
//         email: 'john@example.com',
//         password: 'password',
//       };

//       (userRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);

//       await expect(createUserUseCase.execute(user)).rejects.toThrow(
//         'can not create use as user with is name already exists',
//       );

//       expect(exception.forbiddenException).toHaveBeenCalledWith({
//         message: 'can not create use as user with is name already exists',
//         code_error: 403,
//       });

//       expect(email.sendEmail).not.toHaveBeenCalledWith(
//         user.email,
//         'please change your password',
//         `hey ${user.name} please change to your new custom password`,
//       );
//       expect(userRepository.createUser).not.toHaveBeenCalledWith(user);
//     });
//   });

//   describe('get User By Email', () => {
//     it('should return user', async () => {
//       const user: UserM = {
//         id: 1,
//         name: 'John',
//         role: null,
//         email: 'john@example.com',
//         password: 'password',
//       };

//       vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user);
//       vi.spyOn(exception, 'forbiddenException').mockResolvedValueOnce(null);

//       const result = await getByEmailUseCase.execute('john@example.com');

//       expect(result).toEqual(user);

//       expect(userRepository.findByEmail).toHaveBeenCalledWith(
//         'john@example.com',
//       );

//       expect(exception.forbiddenException).not.toHaveBeenCalled();
//     });

//     it('should throw an forbiddenException if user does not exist', async () => {
//       vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

//       const result = await getByEmailUseCase.execute('john@example.com');

//       expect(result).toBeNull();

//       expect(userRepository.findByEmail).toHaveBeenCalledWith(
//         'john@example.com',
//       );
//       expect(exception.forbiddenException).toHaveBeenCalledWith({
//         message: 'no user with this email',
//         code_error: 403,
//       });
//     });
//   });

//   describe('update user password', () => {
//     it('should update the user password', async () => {
//       const user: UserM = {
//         id: 1,
//         name: 'John',
//         role: null,
//         email: 'john@example.com',
//         password: 'password',
//       };

//       vi.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user);
//       vi.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
//       vi.spyOn(userRepository, 'resetPassword').mockResolvedValueOnce();
//       vi.spyOn(exception, 'badRequestException').mockResolvedValueOnce(null);

//       const result = await updateUserPasswordUseCase.execute(
//         'john@example.com',
//         'password',
//       );

//       expect(userRepository.findByEmail).toHaveBeenCalledWith(
//         'john@example.com',
//       );
//       expect(bcrypt.hash).toHaveBeenCalledWith('password');
//       expect(userRepository.resetPassword).toHaveBeenCalledWith(
//         'john@example.com',
//         'hashedPassword',
//       );
//       expect(result).toBeUndefined();
//       expect(exception.badRequestException).not.toHaveBeenCalled();
//     });
//   });
// });
