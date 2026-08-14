import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class Theatre extends Model {
  public id!: number;
  public name!: string;
  public address!: string | null;
  public city!: string | null;
  public state!: string | null;
  public contact_number!: string | null;
}

Theatre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    contact_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "theatre",
    timestamps: false,
  }
);

export default Theatre;