import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StudentType {
  @Field(() => String)
  id: string;

  @Field({ defaultValue: Date })
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => String)
  email!: string;

  @Field(() => Boolean)
  approve!: boolean;
}
