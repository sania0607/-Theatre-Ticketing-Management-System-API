import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class Screen extends Model {
  public id!: number;
  public theatre_id!: number;
  public name!: string;
  public capacity!: number;
}

Screen.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    theatre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "screen",
    timestamps: false,
  }
);

export default Screen;