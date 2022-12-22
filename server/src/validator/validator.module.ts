import { Module } from '@nestjs/common';
import { UserModule } from '../modules/user/user.module';
import { IsExist } from './is-exist.validator';
import { IsNotExist } from './is-not-exist.validator';
import { PasswordConfirmValidator } from './password-confirm.validator';
import { UniqueEmailValidator } from './unique-email.validator';

@Module({
  imports: [UserModule],
  providers: [PasswordConfirmValidator, UniqueEmailValidator, IsExist, IsNotExist],
  exports: [PasswordConfirmValidator, UniqueEmailValidator, IsExist, IsNotExist],
})
export class ValidatorsModule {}
