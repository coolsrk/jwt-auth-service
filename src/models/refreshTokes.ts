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

@Table
class RefreshToken extends Model<RefreshTokenInterface> {
  @Unique
  @PrimaryKey
  @Column({ type: DataType.UUID })
  tokenId!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  refreshToken!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expiryTime!: string;
}

export default RefreshToken;
