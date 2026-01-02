# Plano de Implementação: OmniFlow Enterprise

**Visão**: Um sistema complexo que simula uma arquitetura de grande porte, onde diferentes serviços usam a ferramenta melhor para cada trabalho.

## Stack Tecnológica & Responsabilidades

| Tecnologia | Função no Sistema | Por que? |
|------------|-------------------|----------|
| **Laravel (PHP)** | **API Gateway & Core** | Sua robustez MVC é perfeita par gerenciar usuários, regras de negócio complexas e disparar eventos. |
| **Redis** | **Message Broker** | O "fio condutor". O Laravel publica mensagens aqui, e o NestJS consome. Baixa latência. |
| **NestJS (Node)** | **Worker Service** | Processamento assíncrono pesado. Node é excelente para I/O e conexões persistentes. |
| **MongoDB** | **Log Store** | Armazenar milhões de logs de eventos. Schema-less é ideal para payloads variáveis. |
| **Vue.js** | **Client App** | Leve e reativo para a interface do usuário final. |
| **Angular** | **Admin Dashboard** | Estruturado e tipado (TypeScript), ideal para painéis administrativos complexos. |

## Arquitetura de Dados

1.  **O Disparo**: Usuário (no **Vue**) clica em "Processar Relatório".
2.  **A Requisição**: Bate no **Laravel**. Laravel valida, salva o pedido no Postgres (status: `PENDING`) e joga um payload no **Redis**.
3.  **O Processamento**: O **NestJS** está ouvindo o Redis. Ele pega o job, processa (simula trabalho pesado), e atualiza o status.
4.  **A Persistência**: O NestJS salva o detalhe técnico da execução ("JSON gigante") no **MongoDB**.
5.  **O Monitoramento**: O Admin (no **Angular**) vê o gráfico de mensagens processadas atualizando em tempo real.

## Estrutura de Diretórios (Monorepo)

```text
/omni-flow
  /backend-core (Laravel)
    /app/Http/Controllers
    /app/Jobs
  /backend-worker (NestJS)
    /src/worker
    /src/schemas (Mongo)
  /frontend-client (Vue)
  /frontend-admin (Angular)
  docker-compose.yml
```

## Workflow de Desenvolvimento (PRs)
Simularemos um ambiente de equipe:
1.  Você cria uma branch `feature/setup-nest`.
2.  Faz os commits.
3.  Abre um "PR" (Vou te ensinar a documentar isso).
4.  Eu "aprovo" (simbolicamente) antes do merge.

## Passo 1: Infraestrutura Unificada
Precisamos de um `docker-compose.yml` monstro que suba:
- PHP 8.3 (Laravel)
- Node 20 (Nest/Fronts)
- Postgres
- MongoDB
- Redis
