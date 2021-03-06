import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  DataTypes,
  Model,
} from "sequelize";
import Post from "./post";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class User extends Model {
  // 타입스크립트 타입 정의
  public id!: number;

  public nickname!: string;

  public userId!: string;

  public password!: string;

  // Belongs-To-Many associations에 의해 자동적으로 만들어진 함수
  // https://sequelize.org/v5/manual/associations.html
  public addFollowing!: BelongsToManyAddAssociationMixin<User, number>;

  public getFollowings!: BelongsToManyGetAssociationsMixin<User>;

  public getFollowers!: BelongsToManyGetAssociationsMixin<User>;

  public removeFollower!: BelongsToManyRemoveAssociationMixin<User, number>;

  public removeFollowing!: BelongsToManyRemoveAssociationMixin<User, number>;

  public readonly Posts?: Post[];

  public readonly Followings?: User[];

  public readonly Followers?: User[];
}

User.init(
  // 실제 db에 모델 작성
  {
    nickname: {
      type: DataTypes.STRING(20), // 20글자 이하
      allowNull: false, // 필수
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // 고유한 값
    },
    password: {
      type: DataTypes.STRING(100), // 100글자 이하
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {
  db.User.hasMany(db.Post, { as: "Posts" });
  db.User.hasMany(db.Comment);
  db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
  db.User.belongsToMany(db.User, {
    through: "Follow",
    as: "Followers",
    foreignKey: "followingId",
  });
  db.User.belongsToMany(db.User, {
    through: "Follow",
    as: "Followings",
    foreignKey: "followerId",
  });
};

export default User;
