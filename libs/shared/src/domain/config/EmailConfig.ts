export interface EmailConfig {
  getEmailSecret(): string;
  getEmailUser(): string;
  getEmailHost(): string;
  getEmailPort(): number;
  getEmailSender(): string;
}
