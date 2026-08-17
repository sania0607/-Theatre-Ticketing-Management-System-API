import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class BookingSeat extends Model {
  public id!: number;
  public booking_id!: number;
  public show_seat_id!: number;
}

BookingSeat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    show_seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "booking_seat",
    timestamps: false,
  }
);

export default BookingSeat;