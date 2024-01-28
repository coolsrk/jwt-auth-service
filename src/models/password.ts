import { Column, DataType, ForeignKey,
   Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import User from './user';
import { PasswordInterface } from '../interfaces/models';
    
@Table
class Password extends Model<PasswordInterface> {
  @Unique
  @PrimaryKey
  @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
  id!: string;
  
  @ForeignKey(()=> User)     
  @Column({type: DataType.UUID})
  userId!: string;

  @Column({type: DataType.STRING, allowNull: false})
  password!: string;
}

export default Password;