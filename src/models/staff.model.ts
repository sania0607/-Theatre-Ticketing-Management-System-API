import {DataTypes,Model,Optional,} from "sequelize";
import { sequelize } from "../config/sequelize";

interface StaffAttributes {
  id: number;
  username: string;
  password: string;
  email?: string | null;
}

interface StaffCreationAttributes
  extends Optional<StaffAttributes, "id" | "email"> {}

class Staff
  extends Model<
    StaffAttributes,
    StaffCreationAttributes
  >
  implements StaffAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string | null;
}

Staff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "staff",
    timestamps: false,
  }
);

export default Staff;