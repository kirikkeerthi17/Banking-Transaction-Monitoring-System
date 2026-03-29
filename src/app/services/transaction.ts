import { Injectable } from '@angular/core';

export interface Transaction {
  user: string;
  id: number;
  refNo: string;
  amount: number;
  type: string;
  date: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  users = ['user1', 'user2', 'user3', 'user4'];

  transactions: Transaction[] = [
    { user: 'user1', id: 1, refNo: 'UTR1001', amount: 5000, type: 'credit', date: '2026-03-29 10:00' },
    { user: 'user1', id: 2, refNo: 'UTR1002', amount: 20000, type: 'debit', date: '2026-03-29 11:00' },

    { user: 'user2', id: 3, refNo: 'UTR2001', amount: 3000, type: 'credit', date: '2026-03-29 12:00' },
    { user: 'user2', id: 4, refNo: 'UTR2002', amount: 15000, type: 'debit', date: '2026-03-29 13:00' },

    { user: 'user3', id: 5, refNo: 'UTR3001', amount: 8000, type: 'credit', date: '2026-03-29 14:00' },
    { user: 'user4', id: 6, refNo: 'UTR4001', amount: 25000, type: 'debit', date: '2026-03-29 15:00' }
  ];

  // RULES
  rules = {
    highAmount: 10000
  };

  // FRAUD LOGIC
  applyRules(t: Transaction): string {

    if (t.amount > this.rules.highAmount) return 'Fraud';

    if (t.type === 'debit' && t.amount > 8000) return 'Fraud';

    if (t.date.includes('03:')) return 'Fraud';

    return 'Normal';
  }

  // GET DATA
  getTransactions(user?: string): Transaction[] {

    let data = user
      ? this.transactions.filter(t => t.user === user)
      : this.transactions;

    return data.map(t => ({
      ...t,
      status: this.applyRules(t)
    }));
  }

  getUsers() {
    return this.users;
  }

  updateRule(key: string, value: any) {
    (this.rules as any)[key] = value;
  }
}