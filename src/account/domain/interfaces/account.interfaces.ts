export interface ITransaction {
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  date: Date;
  balanceAfterTransaction: number;
  description?: string; // Descripción opcional de la transacción
}

// Interfaz para los contactos
export interface IContact {
  name: string;
  accountNumber: string;
  email?: string;
  phone?: string;
}

// Interfaz para el historial de movimientos
export interface IMovement {
  type: 'createAccount' | 'updateAccount' ;
  amount: number;
  date: Date;
  description?: string;
  balanceAfterMovement: number;
}

// Interfaz para la auditoría
export interface IAudit {
  action: string;
  date?: Date;
  details: string;
}

export interface IAccount {
  accountNumber: string;
  owner: string;
  balance: number;
  transactions?: ITransaction[];
  contacts?: IContact[];
  movements?: IMovement[];
  auditLogs?: IAudit[];
  userInfo: IUserInfo;
}

export interface IUserInfo {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  email: string;
  phone: string;
}
