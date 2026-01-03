# Guia: Construindo o Painel Admin (Angular) 🛡️

O Angular é a escolha favorita de grandes empresas para painéis administrativos porque ele é extremamente organizado e robusto. No OmniFlow, ele terá a missão de "Vigiar" o sistema.

### 📜 O Roteiro de Construção

#### 1. O Berço (Setup)
Diferente do Vue onde usamos Vite, aqui usamos o **Angular CLI**. Ele cria uma estrutura pronta para grandes aplicações.
*   **Comando**: `npx -y @angular/cli@latest new frontend-admin --style=css --routing=false --skip-tests`

#### 2. O Mensageiro (`AuditService`)
No Angular, não fazemos requisições direto na tela. Criamos um **Service**.
*   Ele será responsável por ir até o `localhost:3000/logs` (NestJS), buscar os dados e trazer para o Angular.

#### 3. A Central de Comando (`DashboardComponent`)
Aqui criaremos a interface. O foco não será "beleza futurista" como o Vue, mas sim **"Precisão Técnica"**:
*   **Cards de Contagem**: Quantos jobs rodaram hoje?
*   **Tabela de Auditoria**: Lista detalhada de quem disparou o que e quando.
*   **Status Indicators**: Bolinhas verdes/vermelhas mostrando se o NestJS respondeu.

#### 4. O Coração Reativo (Polling)
Para o dashboard não ficar estático, usaremos o **RxJS** (uma ferramenta poderosa do Angular) para atualizar a lista de logs automaticamente a cada poucos segundos.

---

### 🚀 Vamos começar o Step 1?
Vou rodar agora o comando para criar a pasta `frontend-admin`. O Angular demora um pouco mais para "nascer" do que o Vue porque ele já instala muitas ferramentas de proteção de código.

**Posso dar o "start" no nascimento do projeto Angular?** 🦾🦾🦾💪
