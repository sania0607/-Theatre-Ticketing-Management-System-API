import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class Show extends Model {
  public id!: number;
  public movie_id!: number;
  public screen_id!: number;
  public show_date!: Date;
  public start_time!: Date;
  public end_time!: Date;
  public ticket_price!: number;
}

Show.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    screen_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    show_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    ticket_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "show",
    timestamps: false,
  }
);

export default Show;