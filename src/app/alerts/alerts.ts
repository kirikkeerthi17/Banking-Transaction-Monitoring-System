import { Component } from '@angular/core';
import { TransactionService, Transaction } from '../services/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `

  <div class="container">

    <h2>🚨 Fraud Alerts</h2>

    <table>
      <tr>
        <th>SL</th>
        <th>User</th>
        <th>Ref No</th>
        <th>Date</th>
        <th>Amount</th>
      </tr>

      <tr *ngFor="let t of alerts; let i = index">
        <td>{{i + 1}}</td>
        <td>{{t.user}}</td>
        <td>{{t.refNo}}</td>
        <td>{{t.date}}</td>
        <td>₹{{t.amount}}</td>
      </tr>

    </table>

  </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      text-align: center;
      font-family: Arial;
    }

    table {
      width: 80%;
      margin: auto;
      border-collapse: collapse;
    }

    th {
      background: #1e3a8a;
      color: white;
    }

    th, td {
      padding: 10px;
      border: 1px solid #ccc;
    }
  `]
})
export class AlertsComponent {

  alerts: Transaction[] = [];

  constructor(service: TransactionService) {
    this.alerts = service.getTransactions()
      .filter(t => t.status === 'Fraud');
  }
}