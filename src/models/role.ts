import { AutoIncrement, Column, DataType,
  HasOne,
  Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import User from './user';
import { RoleInterface } from '../interfaces/models';
   
@Table({
  timestamps: false
})
class Role extends Model<RoleInterface> {
 @Unique
 @PrimaryKey
 @AutoIncrement
 @Column({type: DataType.INTEGER})
 id!: string;
  
 @Column({type: DataType.STRING})
 role!: string;

 @HasOne(()=> User, 'roleId')
 user!: User;
}

export default Role;
