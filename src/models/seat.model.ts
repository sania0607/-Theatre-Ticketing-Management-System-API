import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class Seat extends Model {
  public id!: number;
  public screen_id!: number;
  public seat_number!: string;
  public row_name!: string;
}

Seat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    screen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seat_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    row_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "seat",
    timestamps: false,
  }
);

export default Seat;