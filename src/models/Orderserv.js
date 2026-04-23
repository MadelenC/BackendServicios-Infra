import { EntitySchema } from "typeorm";

export const Pedidoserv = new EntitySchema({
  name: "Pedidoserv",
  tableName: "pedidoser",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    man_id: {
      type: "varchar",
      nullable: false,
    },
    ins_id: {
      type: "varchar",
      nullable: false,
    },
    taller: {
      type: "varchar",
      nullable: false,
    },
    can1: {
      type: "varchar",
      nullable: false,
    },
    uni1: {
      type: "varchar",
      nullable: false,
    },
    des1: {
      type: "varchar",
      nullable: false,
    },
     can2: {
      type: "varchar",
      nullable: false,
    },
    uni2: {
      type: "varchar",
      nullable: false,
    },
    des2: {
      type: "varchar",
      nullable: false,
    },

     can3: {
      type: "varchar",
      nullable: false,
    },
    uni3: {
      type: "varchar",
      nullable: false,
    },
    des3: {
      type: "varchar",
      nullable: false,
    },
     can4: {
      type: "varchar",
      nullable: false,
    },
    uni4: {
      type: "varchar",
      nullable: false,
    },
    des4: {
      type: "varchar",
      nullable: false,
    },
     can5: {
      type: "varchar",
      nullable: false,
    },
    uni5: {
      type: "varchar",
      nullable: false,
    },
    des5: {
      type: "varchar",
      nullable: false,
    },
     can6: {
      type: "varchar",
      nullable: false,
    },
    uni6: {
      type: "varchar",
      nullable: false,
    },
    des6: {
      type: "varchar",
      nullable: false,
    },
     can7: {
      type: "varchar",
      nullable: false,
    },
    uni7: {
      type: "varchar",
      nullable: false,
    },
    des7: {
      type: "varchar",
      nullable: false,
    },
     can8: {
      type: "varchar",
      nullable: false,
    },
    uni8: {
      type: "varchar",
      nullable: false,
    },
    des8: {
      type: "varchar",
      nullable: false,
    },
     can9: {
      type: "varchar",
      nullable: false,
    },
    uni9: {
      type: "varchar",
      nullable: false,
    },
    des9: {
      type: "varchar",
      nullable: false,
    },
     can10: {
      type: "varchar",
      nullable: false,
    },
    uni10: {
      type: "varchar",
      nullable: false,
    },
    des10: {
      type: "varchar",
      nullable: false,
    },
     can11: {
      type: "varchar",
      nullable: false,
    },
    uni11: {
      type: "varchar",
      nullable: false,
    },
    des11: {
      type: "varchar",
      nullable: false,
    },
    user_id:{
      type:"int",
      nullables:false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    encargado: {
      type: "varchar",
      nullable: false,
    },
    jefe: {
      type: "varchar",
      nullable: false,
    },
    aprobacion: {
      type: "varchar",
      nullable: false,
    },
    estado:{
      type:"varchar",
      nullables:false,
    },
  },
  
});