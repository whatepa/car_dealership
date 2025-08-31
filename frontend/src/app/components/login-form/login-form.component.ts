import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

interface LoginData {
  username: string;
  role: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  onLogin = output<LoginData>();

  constructor(private auth: Auth) {}

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.error = '';

    try {
      const data = await this.auth.login(this.username, this.password);
      this.onLogin.emit({ username: data.username, role: data.role });
    } catch (error) {
      this.error = (error as Error)?.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }
}
