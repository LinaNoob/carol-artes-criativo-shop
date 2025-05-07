
// Gera um token único para acesso a produtos
export const generateToken = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

// Calcula a data de expiração baseado em minutos a partir de agora
export const getExpiryDate = (minutes: number = 30): string => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
  return expiryDate.toISOString();
};

// Converte preço para o formato de moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Gera o QR Code PIX a partir do código PIX copia e cola
export const generateQRCodeUrl = (pixCode: string): string => {
  // Em uma implementação real, isso chamaria uma API para gerar o QR code
  // Por enquanto, vamos usar um serviço público para simular
  return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(pixCode)}&choe=UTF-8`;
};

// Valida um e-mail
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Simula um webhook chamando o n8n ou outro serviço
export const triggerWebhook = async (data: any): Promise<boolean> => {
  console.log("Webhook seria chamado com os dados:", data);
  // Em uma implementação real, isso chamaria um webhook
  // return await fetch('https://n8n.seudominio.com/webhook/123', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.ok);
  
  // Simulação bem-sucedida
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 1000);
  });
};

// Função para verificar se o administrador clicou no logo 5 vezes
let clickCount = 0;
let clickTimer: ReturnType<typeof setTimeout> | null = null;

export const handleLogoClick = (callback: () => void): void => {
  clickCount++;
  
  if (clickTimer) {
    clearTimeout(clickTimer);
  }
  
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 3000);
  
  if (clickCount >= 5) {
    clickCount = 0;
    callback();
  }
};
