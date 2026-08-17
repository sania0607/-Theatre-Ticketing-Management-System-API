import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class ShowSeat extends Model {
  public id!: number;
  public show_id!: number;
  public seat_id!: number;
  public status!: string | null;
  public locked_until!: Date | null;
}

ShowSeat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    show_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "AVAILABLE",
    },

    locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "show_seat",
    timestamps: false,
  }
);

export default ShowSeat;