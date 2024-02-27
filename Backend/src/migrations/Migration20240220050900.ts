import { Migration } from '@mikro-orm/migrations';

export class Migration20240220050900 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `about` varchar(1000) null, add `otp` int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `about`;');
    this.addSql('alter table `user` drop `otp`;');
  }

}
