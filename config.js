// Arquivo: config.js (AJUSTADO PARA PULAR LOADING)

// --- Importação das Imagens Locais ---
const LocalLogo = require('./assets/simple_education.png'); 
const LocalBackground = require('./assets/bg.png'); 


// 1. Configurações Visuais (Mantidas)
export const APP_CONFIG = {
  backgroundImageSource: LocalBackground, 
  backgroundColor: '#5A1F78', 
  logoUrl: LocalLogo, 
  buttonColor: '#ffffff',
  buttonTextColor: '#5A1F78', 
  statusBarColor: 'light-content' 
};

// 2. Lista de Links (Os Botões da Grade 3x2)
export const LINK_BUTTONS = [
  {
    key: 'livro',
    title: 'LIVRO',
    url: 'https://app.simpleeducation.com.br/', 
    icon: 'book',
    skipLoading: false // Mantém o loading
  },
  {
    key: 'teacher',
    title: 'TEACHER ONLINE',
    url: 'https://app.simpleeducation.com.br/messages/view',
    icon: 'chalkboard-teacher',
    skipLoading: false
  },
  {
    key: 'videoaulas',
    title: 'VIDEOAULAS',
    url: 'https://www.youtube.com/playlist?list=PLi9umWrqdnLYDz130vb300NhWk-m9ojim',
    icon: 'play-circle',
    skipLoading: true // 👈 NOVO: Pula o loading
  },
  {
    key: 'dicionario',
    title: 'DICIONÁRIO',
    url: 'https://translate.google.com.br/?sl=pt&tl=en&op=translate',
    icon: 'search',
    skipLoading: true // 👈 NOVO: Pula o loading
  },
  {
    key: 'simplelab',
    title: 'SIMPLELAB',
    url: 'https://simplelab.digitalclasses.com.br/',
    icon: 'desktop',
    skipLoading: false
  },
  {
    key: 'mais',
    title: 'MAIS',
    url: 'https://www.simpleeducation.com.br/',
    icon: 'ellipsis-h',
    skipLoading: false
  },
];