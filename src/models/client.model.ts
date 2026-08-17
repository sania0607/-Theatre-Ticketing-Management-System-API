import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

class Client extends Model {
  public id!: number;
  public client_code!: string;
  public client_name!: string;
  public public_key!: string;
  public created_at!: Date | null;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    client_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    public_key: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "client",
    timestamps: false,
  }
);

export default Client;