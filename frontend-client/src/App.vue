<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { Rocket, CheckCircle, Loader2, Server, Database, MessageSquare } from 'lucide-vue-next'
import ChatComponent from './components/ChatComponent.vue'

const loading = ref(false)
const lastJob = ref(null)
const error = ref(null)

const triggerJob = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('http://localhost:8000/test-job')
    lastJob.value = response.data
  } catch (err) {
    error.value = "Erro ao conectar com o Laravel. Verifique se o container está rodando."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <header class="flex justify-between items-center mb-12">
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">OmniFlow Portal</h1>
      <p class="text-slate-400">Ambiente de Testes do Cliente</p>
    </div>
    <div class="flex gap-4">
      <div class="status-badge status-online flex items-center gap-2">
        <Server :size="16" /> Laravel OK
      </div>
      <div class="status-badge status-online flex items-center gap-2">
        <Database :size="16" /> NestJS OK
      </div>
    </div>
  </header>

  <main class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    <!-- Card de Disparo -->
    <section class="glass-card">
      <div class="flex items-center gap-3 mb-6">
        <Rocket class="text-sky-400" :size="32" />
        <h2 class="text-xl font-semibold">Disparar Relatório</h2>
      </div>
      
      <p class="text-slate-300 mb-8">
        Ao clicar no botão abaixo, o portal enviará uma requisição ao **Laravel**, que publicará um evento no **Redis**. O **NestJS** processará a tarefa e salvará o log no **MongoDB**.
      </p>

      <button 
        @click="triggerJob" 
        :disabled="loading"
        class="btn-primary"
      >
        <Loader2 v-if="loading" class="animate-spin" :size="20" />
        <span v-if="!loading">Disparar Job Agora</span>
        <span v-else>Enviando Mensagem...</span>
      </button>

      <p v-if="error" class="mt-4 text-red-400 text-sm">{{ error }}</p>
    </section>

    <!-- Card de Resultado -->
    <section class="glass-card flex flex-col justify-center items-center text-center">
      <div v-if="!lastJob && !loading" class="text-slate-500">
        <MessageSquare :size="48" class="mb-4 opacity-20" />
        <p>Aguardando o primeiro disparo...</p>
      </div>

      <div v-if="loading" class="text-sky-400">
        <Loader2 class="animate-spin mb-4" :size="48" />
        <p class="animate-pulse">Aguardando resposta do servidor...</p>
      </div>

      <div v-if="lastJob && !loading" class="animate-in fade-in zoom-in duration-300">
        <CheckCircle class="text-green-400 mb-4 mx-auto" :size="48" />
        <h3 class="text-lg font-bold text-white mb-2">Job Enviado com Sucesso!</h3>
        <p class="text-slate-400 text-sm mb-6">Resposta do Laravel:</p>
        
        <div class="bg-black/30 p-4 rounded-lg text-left font-mono text-xs border border-white/10">
          <pre class="text-sky-300">{{ JSON.stringify(lastJob.payload, null, 2) }}</pre>
        </div>
      </div>
    </section>
  </main>

  <!-- Área de Evolução: Chat -->
  <section class="grid grid-cols-1 gap-8">
    <ChatComponent />
  </section>

  <footer class="mt-12 text-center text-slate-500 text-sm pb-8">
    OmniFlow Enterprise &copy; 2026 - Sistema de Mensageria Distribuída
  </footer>
</template>

<style>
/* Estilos específicos baseados no layout do Tailwind (simulado) */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-8 { gap: 2rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-12 { margin-bottom: 3rem; }
.mt-4 { margin-top: 1rem; }
.mt-12 { margin-top: 3rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.p-4 { padding: 1rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: ui-monospace, monospace; }
.text-white { color: #fff; }
.text-slate-400 { color: #94a3b8; }
.text-slate-300 { color: #cbd5e1; }
.text-slate-500 { color: #64748b; }
.text-sky-400 { color: #38bdf8; }
.text-sky-300 { color: #7dd3fc; }
.text-green-400 { color: #4ade80; }
.text-red-400 { color: #f87171; }
.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
</style>
