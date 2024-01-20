import { Column, DataType, HasOne, Length, 
  Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import Password from './password';

interface UserInterface {
    userId?: string;
    name: string;
    lastName?: string;
    mobNo: number;
    password: Password
  }
    

  @Table
  class User extends Model<UserInterface> {
    @Unique
    @PrimaryKey
    @Column({type: DataType.UUID})
    userId!: string;

    @Column({type: DataType.STRING(1024), allowNull: false})
    name!: string;

    @Column({type: DataType.STRING(1024), allowNull: true})
    lastName!: string;

    @Length({max: 10, min:10})
    @Column({type: DataType.BIGINT})
    mobNo!: number;

    @HasOne(()=> Password, 'userId')
    password!: Password;
  }

  export default User;