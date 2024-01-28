import { Column, DataType, HasOne, Length, 
  Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import Password from './password';    
import { UserInterface } from '../interfaces/models';
import Salt from './salt';

@Table
class User extends Model<UserInterface> {
  @Unique
  @PrimaryKey
  @Column({type: DataType.UUID, allowNull: false})
  userId!: string;

  @Column({type: DataType.STRING, allowNull: false})
  name!: string;

  @Column({type: DataType.STRING, allowNull: true})
  lastName!: string;

  @Unique
  @Column({type: DataType.STRING, allowNull: false, validate: {isEmail: true}})
  email!: string;

  @Length({max: 10, min:10})
  @Column({type: DataType.BIGINT, allowNull: true})
  mobNo!: number;

  @Column({type: DataType.STRING, allowNull: true})
  address!: string;

  @HasOne(()=> Password, 'userId')
  password!: Password;

  @HasOne(()=> Salt, 'userId')
  salt!: Salt;
}

export default User;