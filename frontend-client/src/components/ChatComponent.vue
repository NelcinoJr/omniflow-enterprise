<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io } from 'socket.io-client'
import axios from 'axios'
import { Send, MessageSquare, Search, Phone, Video, MoreVertical, Users } from 'lucide-vue-next'

const socket = ref(null)
const newMessage = ref('')
const messages = ref([])
const chatContainer = ref(null)

// Identidade do usuário atual (simulado)
const currentUser = ref('nelcino@omniflow.com')

// Lista de contatos e grupos com estado de "unread"
const contacts = ref([
  { name: 'Grupo OmniFlow Geral', email: 'grupo_geral', lastMsg: 'Bem-vindos!', online: true, isGroup: true, unread: 0 },
  { name: 'Suporte Técnico', email: 'suporte@omniflow.com', lastMsg: 'Como posso ajudar?', online: true, isGroup: false, unread: 0 },
  { name: 'Admin Geral', email: 'admin@omniflow.com', lastMsg: 'Aguardando logs...', online: true, isGroup: false, unread: 0 },
  { name: 'IA Antigravity', email: 'ai@antigravity.com', lastMsg: 'Sistema operacional.', online: false, isGroup: false, unread: 0 }
])

const selectedContact = ref(null)

const switchProfile = (email) => {
  console.log(`Alterando perfil para: ${email}`)
  currentUser.value = email
  if (socket.value) {
    socket.value.emit('identify', email)
  }
  selectedContact.value = null
  messages.value = []
}

const connectSocket = () => {
  socket.value = io('http://localhost:3000')

  socket.value.on('connect', () => {
    console.log('✅ Socket conectado com ID:', socket.value.id)
    socket.value.emit('identify', currentUser.value)
  })

  socket.value.on('receive_message', (msg) => {
    console.log('📩 Nova mensagem recebida:', msg)
    
    // 1. Verifica se a mensagem pertence à conversa selecionada
    const isForSelected = selectedContact.value?.isGroup 
      ? (msg.receiver === selectedContact.value.email)
      : (
          (msg.sender === currentUser.value && msg.receiver === selectedContact.value?.email) ||
          (msg.sender === selectedContact.value?.email && msg.receiver === currentUser.value)
        )

    if (isForSelected) {
      messages.value.push(msg)
      scrollToBottom()
    } else {
      // 2. Se não estiver selecionado, marca como não lida na lista lateral
      const contact = contacts.value.find(c => c.email === msg.sender || (msg.isGroup && c.email === msg.receiver))
      if (contact) {
        contact.unread++
        contact.lastMsg = msg.message
      }
    }
  })
}

const selectContact = async (contact) => {
  console.log(`Selecionando contato: ${contact.name}`)
  selectedContact.value = contact
  contact.unread = 0 // Limpa as mensagens não lidas
  messages.value = []
  
  if (contact.isGroup) {
    socket.value.emit('join_room', contact.email)
  }

  try {
    const response = await axios.get(`http://localhost:3000/chat/history?user1=${currentUser.value}&user2=${contact.email}`)
    messages.value = response.data
    scrollToBottom()
  } catch (err) {
    console.error('❌ Erro ao buscar histórico:', err)
  }
}

const sendMessage = () => {
  if (newMessage.value.trim() && selectedContact.value) {
    console.log(`Enviando mensagem para: ${selectedContact.value.email}`)
    socket.value.emit('send_message', {
      sender: currentUser.value,
      receiver: selectedContact.value.email,
      message: newMessage.value.trim(),
      isGroup: selectedContact.value.isGroup
    })
    newMessage.value = ''
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(() => {
  connectSocket()
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})
</script>

<template>
  <div class="whatsapp-layout glass-card">
    <aside class="contacts-sidebar">
      <div class="sidebar-header">
        <label class="sidebar-label">EU SOU:</label>
        <select :value="currentUser" @change="e => switchProfile(e.target.value)" class="profile-select">
          <option value="nelcino@omniflow.com">Nelcino (Minha Conta)</option>
          <option value="suporte@omniflow.com">Suporte Técnico</option>
          <option value="admin@omniflow.com">Administrador</option>
        </select>
      </div>
      
      <div class="search-box">
        <div class="search-input-wrapper">
          <Search :size="16" />
          <input placeholder="Filtrar conversas..." />
        </div>
      </div>

      <div class="contacts-list">
        <div 
          v-for="contact in contacts" 
          :key="contact.email"
          @click="selectContact(contact)"
          :class="['contact-item', selectedContact?.email === contact.email ? 'active' : '']"
        >
          <div :class="['avatar', contact.isGroup ? 'group' : '']">
            <Users v-if="contact.isGroup" :size="20" />
            <span v-else>{{ contact.name[0] }}</span>
          </div>
          <div class="contact-info">
            <div class="contact-name-row">
              <span class="name">{{ contact.name }}</span>
              <span v-if="contact.unread > 0" class="unread-badge">{{ contact.unread }}</span>
            </div>
            <p class="last-msg">{{ contact.lastMsg }}</p>
          </div>
        </div>
      </div>
    </aside>

    <main class="chat-main">
      <template v-if="selectedContact">
        <header class="chat-header">
          <div class="contact-meta">
            <div :class="['avatar', selectedContact.isGroup ? 'group' : '']">
              <Users v-if="selectedContact.isGroup" :size="20" />
              <span v-else>{{ selectedContact.name[0] }}</span>
            </div>
            <div class="meta-names">
              <h3>{{ selectedContact.name }}</h3>
              <span class="status">visto recentemente</span>
            </div>
          </div>
          <div class="header-actions">
            <Phone :size="18" />
            <Video :size="18" />
            <MoreVertical :size="18" />
          </div>
        </header>

        <div class="chat-content" ref="chatContainer">
          <div 
            v-for="(msg, idx) in messages" 
            :key="idx" 
            :class="['msg-line', msg.sender === currentUser ? 'sent' : 'received']"
          >
            <div class="msg-bubble">
              <div v-if="selectedContact.isGroup && msg.sender !== currentUser" class="bubble-sender">
                {{ msg.sender.split('@')[0] }}
              </div>
              <p>{{ msg.message }}</p>
              <div class="bubble-footer">
                <span class="msg-time">{{ new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
              </div>
            </div>
          </div>
        </div>

        <footer class="chat-footer">
          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
            placeholder="Mensagem..." 
            class="msg-input"
          />
          <button @click="sendMessage" class="send-btn" :disabled="!newMessage.trim()">
            <Send :size="20" />
          </button>
        </footer>
      </template>

      <div v-else class="empty-state">
        <div class="empty-icon-box">
          <MessageSquare :size="60" />
        </div>
        <h2>Selecione uma conversa</h2>
        <p>No 1-para-1, abra duas janelas e selecione perfis diferentes para ver a mágica.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.whatsapp-layout { display: flex; height: 600px; background: #0b141a; border-radius: 12px; overflow: hidden; }
.contacts-sidebar { width: 300px; border-right: 1px solid #2a3942; display: flex; flex-direction: column; }
.sidebar-header { padding: 15px; background: #202c33; display: flex; flex-direction: column; gap: 5px; }
.sidebar-label { color: #8696a0; font-size: 10px; font-weight: bold; text-transform: uppercase; }
.profile-select { background: #2a3942; color: #e9edef; border: 1px solid #3b4a54; padding: 8px; border-radius: 6px; font-size: 0.85rem; outline: none; }
.search-box { padding: 8px 15px; background: #111b21; }
.search-input-wrapper { background: #202c33; padding: 6px 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px; color: #8696a0; }
.search-input-wrapper input { background: transparent; border: none; color: #d1d7db; width: 100%; font-size: 0.85rem; }
.contacts-list { flex: 1; overflow-y: auto; }
.contact-item { display: flex; padding: 12px 15px; gap: 12px; cursor: pointer; transition: 0.2s; border-bottom: 1px solid #202c33; }
.contact-item:hover { background: #202c33; }
.contact-item.active { background: #2a3942; }
.avatar { width: 45px; height: 45px; border-radius: 50%; background: #008069; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
.avatar.group { background: #53bdeb; }
.contact-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
.contact-name-row { display: flex; justify-content: space-between; align-items: center; }
.name { color: #e9edef; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.unread-badge { background: #00a884; color: #0b141a; font-size: 0.7rem; font-weight: bold; padding: 1px 6px; border-radius: 10px; }
.last-msg { color: #8696a0; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.chat-main { flex: 1; display: flex; flex-direction: column; background: #0b141a; position: relative; }
.chat-header { padding: 10px 15px; background: #202c33; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2a3942; }
.contact-meta { display: flex; align-items: center; gap: 12px; }
.meta-names h3 { color: #e9edef; font-size: 0.95rem; margin: 0; }
.status { color: #8696a0; font-size: 0.7rem; }
.header-actions { display: flex; gap: 20px; color: #aebac1; cursor: pointer; }
.chat-content { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; background-attachment: fixed; }
.msg-line { display: flex; width: 100%; margin: 2px 0; }
.msg-line.sent { justify-content: flex-end; }
.msg-line.received { justify-content: flex-start; }
.msg-bubble { max-width: 65%; padding: 6px 10px; border-radius: 8px; color: #e9edef; font-size: 0.85rem; position: relative; box-shadow: 0 1px 1px rgba(0,0,0,0.3); }
.sent .msg-bubble { background: #005c4b; border-top-right-radius: 0; }
.received .msg-bubble { background: #202c33; border-top-left-radius: 0; }
.bubble-sender { color: #f2c94c; font-size: 0.7rem; font-weight: bold; margin-bottom: 3px; }
.bubble-footer { display: flex; justify-content: flex-end; margin-top: 2px; }
.msg-time { font-size: 0.6rem; color: #8696a0; opacity: 0.8; }
.chat-footer { padding: 10px 15px; background: #202c33; display: flex; gap: 10px; align-items: center; }
.msg-input { flex: 1; background: #2a3942; border: none; color: #d1d7db; padding: 10px 15px; border-radius: 20px; outline: none; font-size: 0.9rem; }
.send-btn { background: transparent; border: none; color: #8696a0; cursor: pointer; }
.send-btn:hover:not(:disabled) { color: #00a884; }
.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #8696a0; }
.empty-icon-box { background: #202c33; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.empty-state h2 { color: #e9edef; font-weight: 300; margin: 10px 0; }
</style>
