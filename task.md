# Projeto: OmniFlow Enterprise (Sistema de Mensageria Distribuída)

**Objetivo**: Criar um ecossistema completo de mensageria e filas, demonstrando domínio total sobre múltiplas stacks (PHP & Node).
**Stack**: Laravel, NestJS, MongoDB, Redis, Angular, Vue.

## Fase 1: O Core Orchestrator (Laravel + MVC)
- [x] **Setup Laravel (Já iniciado)** <!-- id: 1 -->
    - [ ] Configurar Autenticação (Breeze/Sanctum) <!-- id: 2 -->
    - [ ] **Redis Setup**: Configurar conexão para filas <!-- id: 3 -->
    - [ ] Producer Service: Criar lógica para enviar mensagens para o Redis <!-- id: 4 -->

## Fase 2: O Worker de Alta Performance (NestJS)
- [x] **Microserviço NestJS** <!-- id: 5 -->
    - [ ] Inicializar projeto NestJS (`nest new worker-service`) <!-- id: 6 -->
    - [ ] Conectar ao **Redis** (Mesma instância do Laravel) <!-- id: 7 -->
    - [ ] Conectar ao **MongoDB** (Mongoose) <!-- id: 8 -->
    - [ ] Lógica: Consumir fila do Laravel e salvar log no Mongo <!-- id: 9 -->

## Fase 3: Dados e Infraestrutura
- [x] **Infraestrutura Docker (O Desafio)** <!-- id: 10 -->
    - [ ] `docker-compose.yml` unificado: Laravel, NestJS, Postgres, Mongo, Redis <!-- id: 11 -->
    - [ ] Redes internas para comunicação entre containers <!-- id: 12 -->

## Fase 4: Múltiplos Frontends (A Prova de Fogo)
- [x] **Portal do Cliente (Vue.js)** <!-- id: 13 -->
    - [ ] Dashboard para disparar mensagens/tarefas <!-- id: 14 -->
    - [ ] Consumo da API Laravel <!-- id: 15 -->
- [x] **Painel de Controle (Angular)** <!-- id: 16 -->
    - [ ] Monitoramento em Tempo Real (Websockets) <!-- id: 17 -->
    - [ ] Visualização de Logs do MongoDB <!-- id: 18 -->

## Fase 5: Qualidade & Processos (PRs & Git)
- [ ] **Simulação de Workflow Enterprise** <!-- id: 19 -->
    - [ ] Proteger branch `main` <!-- id: 20 -->
    - [ ] Criar Template de Pull Request (PR) <!-- id: 21 -->
    - [ ] Code Review (Eu serei seu revisor) <!-- id: 22 -->
