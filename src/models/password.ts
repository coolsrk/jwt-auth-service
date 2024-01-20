import { Column, DataType, ForeignKey,
   Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import User from './user';

interface PasswordInterface {
    id? : string;
    userId: string;
    passwordData?: string;
  }
    
  @Table
  class Password extends Model<PasswordInterface> {
    @Unique
    @PrimaryKey
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id!: string;
    
    @ForeignKey(()=> User)     
    // @BelongsTo(() => User, 'userId')
    @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4})
    userId!: string;


    @Column({type: DataType.STRING(1024), allowNull: false})
    passwordData!: string;
  }

  export default Password;