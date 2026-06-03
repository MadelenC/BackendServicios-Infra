// models/UserInstitution.js

import { EntitySchema } from "typeorm";

export const UserInstitution = new EntitySchema({
  name: "UserInstitution",
  tableName: "user_institution",

  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },

    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },

    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
    },

    institution: {
      type: "many-to-one",
      target: "Institution",
      joinColumn: {
        name: "institution_id",
      },
    },
  },
});