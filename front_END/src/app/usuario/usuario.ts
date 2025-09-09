import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface para representar um usuário
interface Usuario {
  id?: number; // opcional, pois o banco gera sozinho
  nome_usuario: string;
  senha: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = []; // lista que vem do backend
  novoUsuario: Usuario = { nome_usuario: '', senha: '' };
  mensagem: string = '';
  tipoMensagem: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.buscarUsuarios();
  }

  // GET - buscar todos
  buscarUsuarios() {
    this.http.get<Usuario[]>('http://localhost:3000/usuario')
      .subscribe((res) => this.usuarios = res);
  }

  // POST - cadastrar novo
  adicionarUsuario() {
    this.http.post<Usuario>('http://localhost:3000/usuario', this.novoUsuario)
      .subscribe({
        next: () => {
          this.novoUsuario = { nome_usuario: '', senha: '' };
          this.buscarUsuarios();
          this.exibirMensagem('Usuário cadastrado com sucesso!', 'success');
        },
        error: () => this.exibirMensagem('Erro ao cadastrar usuário.', 'danger')
      });
  }

  // PATCH - atualizar nome
  atualizarUsuario(usuario: Usuario) {
    this.http.patch(`http://localhost:3000/usuario/${usuario.id}`, {
      nome_usuario: usuario.nome_usuario
    }).subscribe(() => {
      this.exibirMensagem('Usuário atualizado!', 'info');
      this.buscarUsuarios();
    });
  }

  // DELETE - excluir
  excluirUsuario(id: number) {
    this.http.delete(`http://localhost:3000/usuario/${id}`)
      .subscribe(() => {
        this.exibirMensagem('Usuário excluído.', 'danger');
        this.buscarUsuarios();
      });
  }

  // Função pra exibir mensagem temporária
  exibirMensagem(
    texto: string,
    tipo: 'success' | 'danger' | 'warning' | 'info' = 'success'
  ) {
    this.mensagem = texto;
    this.tipoMensagem = tipo;
    setTimeout(() => this.mensagem = '', 3000);
  }
}
