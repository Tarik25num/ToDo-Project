import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth-service/authservice';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { Task } from '../services/task';
import { FormsModule } from '@angular/forms';
import { TaskModel } from '../services/task.model';

@Component({
  selector: 'app-dashboard',
  imports: [JsonPipe, FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService)
  private http = inject(HttpClient)
  private taskService = inject(Task)

  newTaskLabel = ''
  tasks: any[] = []
  tasksModel: TaskModel[] = []
  editingTaskId: string | null = null
  editedTask: string = ''


  ngOnInit(): void {
    this.fetchTasks()
    this.getUsername()
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        console.log('task reçu', res)
        this.tasks = res.data as TaskModel[]
      },
      error: (err) => {
        console.error(err)
        alert("Erreur lors du chargement des tâches")
      }
    })
  }

  addTask() {
    if (!this.newTaskLabel.trim()) return

    this.taskService.createTask({ label: this.newTaskLabel }).subscribe({
      next: (res) => {
        console.log('Réponse création tâche:', res)
        // On reset le champ input
        this.newTaskLabel = ''

        // Si la réponse contient bien la tâche complète, on peut push
        const newTask = res.task ?? res.data ?? null
        if (newTask && Array.isArray(this.tasks)) {
          this.tasks.push(newTask)
        } else {
          // Sinon on recharge toute la liste
          this.fetchTasks()
        }
      },
      error: (err) => {
        console.error('Erreur lors de la création de tâche:', err)
        alert("Erreur lors de l'ajout de la tâche")
      }
    })
  }

  deleteTask(id: string) {
    console.log('Suppression de la tâche avec ID:', id)
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id)
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la tâche:', err)
        alert('Erreur lors de la suppression de la tâche')
      }
    })
  }

  startEdit(task: TaskModel) {
    this.editingTaskId = task.id
    this.editedTask = task.label
  }

  cancelEdit() {
    this.editingTaskId = null
    this.editedTask = ''
  }

  confirmEdit() {
  if (!this.editingTaskId || !this.editedTask.trim()) return;

  this.taskService.updateTaskLabel(this.editingTaskId, this.editedTask).subscribe({
    next: () => {
      const task = this.tasks.find(t => t.id === this.editingTaskId)
      if (task) task.label = this.editedTask
      this.cancelEdit()
    },
    error: (err) => {
      console.error('Erreur modification :', err)
      alert('Impossible de modifier la tâche')
    }
  });
}

  toggleTaskDone(task: TaskModel) {
    const updatedDone = !task.done

    this.taskService.updateTaskDone(task.id, updatedDone).subscribe({
      next: () => {
        task.done = updatedDone
      },
      error: (err) => {
        console.error("Erreur mise à jour done:", err)
        alert("Impossible de changer le statut")
      }
    })
  }

  updateTaskLabel(task: TaskModel, newLabel: string) {
    this.taskService.updateTaskLabel(task.id, newLabel).subscribe({
      next: () => {
        task.label = newLabel
      },
      error: (err) => {
        console.error("Erreur de mise à jour du label:", err)
        alert("Impossible de modifier le libellé de la tâche")
      }
    })
  }

  // variable disponible pour savoir si l'utilisateur est connecté
  isLoggedIn = this.authService.isLoggedIn
  data: any = null
  username: string = ''

  logout() {
    this.authService.logout()
  }

  loadData() {
    // Le token sera automatiquement ajouté par l'intercepteur
    this.http.get('https://todof.woopear.fr/api/v1/user/profil').subscribe({
      next: (response) => this.data = response,
      error: (error) => console.error('Erreur:', error)
    })
  }

  getUsername(){
    this.http.get('https://todof.woopear.fr/api/v1/user/profil').subscribe({
      next: (res:any) => {
        this.username = res.data.username
      },
      error: (err) => console.error("Erreur lors de la récupération du nom", err)
    })
  }

}
