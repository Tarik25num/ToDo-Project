import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateUser } from '../services/create-user';
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = ''
  email = ''
  password = ''
  loading = signal(false)
  errorMessage = signal('')

  
  private router = inject(Router)
  private createUserService = inject(CreateUser)

  register() {
    this.createUserService.createUser({ username: this.username, email: this.email, password: this.password })
      .subscribe(
        {
          next: (data) => {
            this.router.navigate(['/login'])
            alert("Utilisateur créé avec succès")
            console.log(data)
          },
          error: (error) => {
            alert("Erreur lors de la création de l'utilisateur")
            console.error('Erreur lors de la création de l\'utilisateur', error)
          }
        }
      )
  }
}
