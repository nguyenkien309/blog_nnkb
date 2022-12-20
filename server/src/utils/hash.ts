import * as bcrypt from 'bcrypt';

export class Hash {
  static make(plainText) {
    return bcrypt.hashSync(plainText, process.env.BCRYPT_SALT);
  }

  static compare(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}
