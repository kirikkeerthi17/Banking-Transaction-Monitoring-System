import { Component } from '@angular/core';
import { TransactionService, Transaction } from '../services/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],   // ⚠️ IMPORTANT
  template: `
    <h2>Transactions</h2>

    <table border="1">
      <tr>
        <th>ID</th><th>Amount</th><th>Status</th>
      </tr>

      <tr *ngFor="let t of transactions">
        <td>{{t.id}}</td>
        <td>{{t.amount}}</td>
        <td [style.color]="t.status==='Fraud' ? 'red':'green'">
          {{t.status}}
        </td>
      </tr>
    </table>
  `
})
export class TransactionsComponent {   // ⚠️ MUST MATCH NAME

  transactions: Transaction[] = [];

  constructor(service: TransactionService) {
    this.transactions = service.getTransactions();
  }
}