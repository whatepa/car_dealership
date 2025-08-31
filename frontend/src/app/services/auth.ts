import { Injectable } from '@angular/core';

interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'token';
  private readonly userKey = 'user';

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Login failed');
    }

    localStorage.setItem(this.tokenKey, data.token);
    localStorage.setItem(
      this.userKey,
      JSON.stringify({ username: data.username, role: data.role })
    );

    return data as LoginResponse;
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    try {
      await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } finally {
      this.clearSession();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser<T = { username: string; role: string } | null>(): T | null {
    const saved = localStorage.getItem(this.userKey);
    return saved ? (JSON.parse(saved) as T) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
