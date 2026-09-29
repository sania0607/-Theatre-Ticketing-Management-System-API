import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class Booking extends Model {
  public id!: number;
  public show_id!: number;
  public aggregator_name!: string | null;
  public booking_reference!: string | null;
  public booking_status!: string | null;
  public total_amount!: number | null;
  public stripe_checkout_session_id!: string | null;
  public booked_at!: Date | null;
}

Booking.init(
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

    aggregator_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    booking_reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    booking_status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "PENDING",
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    stripe_checkout_session_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    booked_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "booking",
    timestamps: false,
  }
);

export default Booking;