import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService, AuditLog } from './audit.service';
import { timer, Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit, OnDestroy {
  logs: AuditLog[] = [];
  lastUpdate: Date = new Date();
  isLoading = true;
  private pollingSub?: Subscription;

  constructor(private auditService: AuditService) { }

  ngOnInit() {
    this.pollingSub = timer(0, 5000)
      .pipe(
        tap(() => this.isLoading = (this.logs.length === 0)),
        switchMap(() => this.auditService.getLogs())
      )
      .subscribe({
        next: (data) => {
          this.logs = data;
          this.lastUpdate = new Date();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar logs:', err);
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }

  getStatusClass(status: string) {
    return status === 'SUCCESS' ? 'badge-success' : 'badge-warning';
  }
}
