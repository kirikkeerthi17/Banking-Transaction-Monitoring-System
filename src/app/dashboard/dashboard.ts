import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService, Transaction } from '../services/transaction';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

  <!-- HEADER -->
  <div class="header">
    <h2>🏦 Secure Bank</h2>
    <div>
      <span>{{role | uppercase}}</span>
      <button (click)="logout()">Logout</button>
    </div>
  </div>

  <div class="container">

    <!-- ADMIN USER SELECT -->
    <div *ngIf="role==='admin'" class="users">
      <h3>Select User</h3>

      <!-- ✅ FIXED DROPDOWN -->
      <select #userSelect (change)="selectUser(userSelect.value)">
        <option value="">All Users</option>
        <option *ngFor="let u of users" [value]="u">{{u}}</option>
      </select>
    </div>

    <!-- SEARCH + FILTER -->
    <div class="filters">
      <input placeholder="🔍 Search ID / RefNo" [(ngModel)]="searchText">

      <select [(ngModel)]="filterStatus">
        <option value="">All</option>
        <option value="Fraud">Fraud</option>
        <option value="Normal">Normal</option>
      </select>
    </div>

    <!-- TABLE -->
    <div class="table-box">
      <table>
        <tr>
          <th>SL</th>
          <th>Ref No</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Status</th>
          <th *ngIf="role==='admin'">Edit</th>
        </tr>

        <tr *ngFor="let t of filtered(); let i=index">
          <td>{{i+1}}</td>
          <td>{{t.refNo}}</td>
          <td>{{t.date}}</td>
          <td>₹{{t.amount}}</td>
          <td>{{t.type}}</td>
          <td [class.fraud]="t.status==='Fraud'">{{t.status}}</td>

          <td *ngIf="role==='admin'">
            <button (click)="editTransaction(t)">Edit</button>
          </td>
        </tr>
      </table>
    </div>

    <!-- RULE CONTROL -->
    <div *ngIf="role==='admin'" class="rules">
      <h3>⚙️ Fraud Rules</h3>

      <label>High Amount Limit:</label>
      <input type="number" [(ngModel)]="highAmount">

      <button (click)="updateRules()">Update</button>
    </div>

  </div>
  `,
  styles: [`
    .header {
      background:#1e3a8a;
      color:white;
      padding:15px;
      display:flex;
      justify-content:space-between;
    }

    .container { padding:20px; }

    .filters { margin:15px 0; }

    input, select {
      padding:8px;
      margin-right:10px;
    }

    .table-box {
      background:white;
      padding:10px;
      border-radius:10px;
      box-shadow:0 5px 10px rgba(0,0,0,0.1);
    }

    table {
      width:100%;
      border-collapse:collapse;
    }

    th {
      background:#1e3a8a;
      color:white;
    }

    th, td {
      padding:10px;
      border:1px solid #ddd;
      text-align:center;
    }

    .fraud {
      color:red;
      font-weight:bold;
    }

    button {
      background:#3b82f6;
      color:white;
      border:none;
      padding:5px 10px;
      border-radius:5px;
    }

    .rules {
      margin-top:20px;
      background:#f1f5f9;
      padding:10px;
    }
  `]
})
export class DashboardComponent {

  role = '';
  users: string[] = [];
  selectedUser = '';

  transactions: Transaction[] = [];

  searchText = '';
  filterStatus = '';

  highAmount = 10000;

  constructor(private service: TransactionService, private router: Router) {

    // ✅ SSR SAFE ROLE
    if (typeof window !== 'undefined') {
      this.role = localStorage.getItem('role') || '';
    }

    // 👑 ADMIN
    if (this.role === 'admin') {
      this.users = this.service.getUsers();
      this.transactions = this.service.getTransactions();
    } 
    // 👤 USER
    else {
      let user = '';

      if (typeof window !== 'undefined') {
        user = localStorage.getItem('user') || '';
      }

      this.transactions = this.service.getTransactions(user);
    }
  }

  selectUser(user: string) {
    this.selectedUser = user;

    this.transactions = user
      ? this.service.getTransactions(user)
      : this.service.getTransactions();
  }

  filtered() {
    return this.transactions.filter(t => {

      const matchSearch =
        this.searchText === '' ||
        t.refNo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        t.id.toString().includes(this.searchText);

      const matchFilter =
        this.filterStatus === '' || t.status === this.filterStatus;

      return matchSearch && matchFilter;
    });
  }

  editTransaction(t: Transaction) {
    const amount = prompt('Enter amount:', t.amount.toString());
    const status = prompt('Enter status (Fraud/Normal):', t.status);

    if (amount) t.amount = Number(amount);
    if (status) t.status = status;
  }

  updateRules() {
    this.service.updateRule('highAmount', this.highAmount);
    alert('Rules Updated');

    this.transactions = this.service.getTransactions(this.selectedUser || undefined);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/']);
  }
}