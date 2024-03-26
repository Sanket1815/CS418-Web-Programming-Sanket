import { Migration } from '@mikro-orm/migrations';

export class Migration20240321012157 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `AdvisoryRecord` (`id` varchar(36) not null, `created_at` datetime null, `updated_at` datetime null, `term` varchar(255) null, `status` varchar(255) null, `gpa` varchar(255) null, `last_term` varchar(255) null, `courses` json null, `prerequisites` json null, `user_id` varchar(36) null, primary key (`id`)) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `AdvisoryRecord` add index `AdvisoryRecord_user_id_index`(`user_id`);');

    this.addSql('create table `advisory_record_details` (`id` varchar(36) not null, `created_at` datetime null, `updated_at` datetime not null, `advisory_record_id` varchar(36) not null, `course_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 collate utf8mb4_unicode_ci engine = InnoDB;');
    this.addSql('alter table `advisory_record_details` add index `advisory_record_details_advisory_record_id_index`(`advisory_record_id`);');
    this.addSql('alter table `advisory_record_details` add index `advisory_record_details_course_id_index`(`course_id`);');

    this.addSql('alter table `AdvisoryRecord` add constraint `AdvisoryRecord_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `advisory_record_details` add constraint `advisory_record_details_advisory_record_id_foreign` foreign key (`advisory_record_id`) references `AdvisoryRecord` (`id`) on update cascade;');
    this.addSql('alter table `advisory_record_details` add constraint `advisory_record_details_course_id_foreign` foreign key (`course_id`) references `course` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `advisory_record_details` drop foreign key `advisory_record_details_advisory_record_id_foreign`;');

    this.addSql('drop table if exists `AdvisoryRecord`;');

    this.addSql('drop table if exists `advisory_record_details`;');
  }

}
