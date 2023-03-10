import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isEmailUnique', async: true })
@Injectable()
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is taken, please try another`;
  }

  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const result = await this.userService.findByEmail(value);
    return !result;
  }
}
