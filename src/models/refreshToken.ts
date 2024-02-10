import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import User from './user';
import { RefreshTokenInterface } from '../interfaces/models';
import Role from './role';

@Table
class RefreshToken extends Model<RefreshTokenInterface> {
  @Unique
  @PrimaryKey
  @Column({ type: DataType.UUID })
  refreshToken!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId!: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER})
  roleId!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  expiryTime!: string;
}

export default RefreshToken;
