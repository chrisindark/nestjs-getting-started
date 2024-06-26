import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class GraphqlModule {}
