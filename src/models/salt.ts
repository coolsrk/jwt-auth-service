import { Column, DataType, ForeignKey,
  Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import User from './user';
import { SaltInterface } from '../interfaces/models';

@Table
class Salt extends Model<SaltInterface> {
  @Unique
  @PrimaryKey
  @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
  id!: string;
  
  @ForeignKey(()=> User)     
  @Column({type: DataType.UUID})
  userId!: string;

  @Column({type: DataType.STRING, allowNull: false})
  salt!: string;
}

export default Salt;