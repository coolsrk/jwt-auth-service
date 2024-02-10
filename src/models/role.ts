import { AutoIncrement, Column, DataType,
  Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
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
}

export default Role;
