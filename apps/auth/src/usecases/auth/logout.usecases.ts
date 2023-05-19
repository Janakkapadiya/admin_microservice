export class LogoutUseCases {
  async execute(): Promise<string[]> {
    return ['Authentication=; HttpOnly; Path=/; maxAge=0'];
  }
}
