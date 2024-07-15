import { Schema, Document, model, Model } from 'mongoose';
import { ITransaction, IContact, IMovement, IAudit, IUserInfo } from "src/account/domain/interfaces/account.interfaces";

export interface IAccountDocument extends Document {
   _id?: string; 
  accountNumber: string;
  owner: string;
  balance: number;
  transactions?: ITransaction[];
  contacts?: IContact[];
  movements?: IMovement[];
  auditLogs?: IAudit[];
  userInfo: IUserInfo;
}

const transactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  balanceAfterTransaction: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
});

const movementSchema = new Schema<IMovement>({
  type: {
    type: String,
    enum: ['createAccount', 'updateAccount',],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
  balanceAfterMovement: {
    type: Number,
    required: true,
  }
});

const auditSchema = new Schema<IAudit>({
  action: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: String,
    required: true,
  },
});

const userInfoSchema = new Schema<IUserInfo>({
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

export const accountSchema = new Schema<IAccountDocument>({
  accountNumber: {
    type: String,
    unique: true,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: {
    type: [transactionSchema],
    default: [],
  },
  contacts: {
    type: [contactSchema],
    default: [],
  },
  movements: {
    type: [movementSchema],
    default: [],
  },
  auditLogs: {
    type: [auditSchema],
    default: [],
  },
  userInfo: {
    type: userInfoSchema,
    required: true,
  },
});

export const AccountModel: Model<IAccountDocument> = model<IAccountDocument>('Account', accountSchema);
