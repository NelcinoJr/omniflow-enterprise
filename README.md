# OmniFlow Enterprise 🚀
> **Arquitetura de Mensageria Distribuída Híbrida (PHP & Node.js)**

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)
![Docker](https://img.shields.io/badge/Docker-Enterprise-2496ED?style=for-the-badge&logo=docker)
![Redis](https://img.shields.io/badge/Redis-Message_Broker-DC382D?style=for-the-badge&logo=redis)
![MongoDB](https://img.shields.io/badge/MongoDB-Log_Store-47A248?style=for-the-badge&logo=mongodb)

O **OmniFlow Enterprise** é uma prova de conceito de um sistema de orquestração de tarefas de alta performance, demonstrando como integrar o melhor de dois mundos: a robustez do **Laravel** para regras de negócio e a velocidade do **NestJS** para processamento assíncrono.

---

## 🏗️ Arquitetura do Sistema

O projeto utiliza uma abordagem de **Microsserviços** orquestrados via Docker Compose.

### 1. Backend Core (`/backend-core`)
- **Stack**: PHP 8.3 + Laravel 11.
- **Responsabilidade**: API Gateway, Autenticação (Sanctum/JWT), Gestão de Usuários e **Producer** (Publicador) de mensagens.
- **Banco de Dados**: PostgreSQL 15.

### 2. Backend Worker (`/backend-worker`)
- **Stack**: Node.js v20 + NestJS.
- **Responsabilidade**: **Consumer** de alta performance. Escuta filas do Redis, processa jobs pesados e persiste logs de auditoria.
- **Banco de Dados**: MongoDB 6.0 (Armazenamento de Logs JSON).

### 3. Infraestrutura (`docker-compose.yml`)
- **Redis**: Atua como *Message Broker* central, desacoplando o Laravel do NestJS.
- **Rede Interna**: Todos os serviços se comunicam via rede `omniflow-network` isolada.

---

## 🚀 Como Rodar (Getting Started)

### Pré-requisitos
- Docker & Docker Compose
- Git

### Instalação (Comando Único)

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USER/omniflow-enterprise.git
cd omniflow-enterprise

# 2. Suba a infraestrutura completa
docker-compose up --build -d

# 3. Configure o Laravel (Primeira vez apenas)
# Copia o .env e gera a chave de segurança
copy backend-core\.env.example backend-core\.env
docker-compose exec backend-core php artisan key:generate
```

### Acessando os Serviços
- **Laravel Core (API)**: `http://localhost:8000`
- **NestJS Worker**: `http://localhost:3000`
- **Frontend Client (Vue)**: `http://localhost:5173` (Requer `npm run dev` local)
- **Frontend Admin (Angular)**: `http://localhost:4200` (Requer `npm start` local)

---

## 🔧 Padrões de Projeto Utilizados
- **Hexagonal Architecture Concepts**: Separação clara entre Domínio e Infraestrutura.
- **Event-Driven Architecture**: Comunicação assíncrona via Redis Pub/Sub.
- **Monorepo**: Gestão unificada de múltiplos serviços para facilitar o versionamento.

---

### Autor
Desenvolvido por **Nelcino Junior** - *Tech Lead & Software Architect*
