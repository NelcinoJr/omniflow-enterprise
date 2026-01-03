import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
    _id: string;
    task_type: string;
    user_email: string;
    payload: any;
    status: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private apiUrl = 'http://localhost:3000/logs';

    constructor(private http: HttpClient) { }

    getLogs(): Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(this.apiUrl);
    }
}
