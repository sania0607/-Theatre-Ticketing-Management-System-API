import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class Movie extends Model {
  public id!: number;
  public title!: string;
  public genre!: string | null;
  public language!: string | null;
  public duration!: number | null;
  public release_date!: Date | null;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    genre: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    language: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "movie",
    timestamps: false,
  }
);

export default Movie;