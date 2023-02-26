const { Client,LocalAuth} = require('whatsapp-web.js');
const natural = require('natural');
const qrcode = require('qrcode-terminal');

// Inicializa o cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
});

// Quando o cliente estiver pronto, execute a função callback
client.on('ready', () => {
  console.log('O cliente está pronto!');
});

// Quando uma mensagem é recebida
client.on('message', async (msg) => {
  // Verifica se a mensagem veio de um usuário e se não é uma mensagem de sistema
  if (msg.fromMe || msg.type !== 'chat') {
    return;
  }

  // Obtém o texto da mensagem recebida
  const text = msg.body.toLowerCase();

  // Realiza o processamento de linguagem natural
  const classifier = new natural.BayesClassifier();
  classifier.addDocument('hello', 'cumprimento');
  classifier.addDocument('hi', 'cumprimento');
  classifier.addDocument('como vai?', 'cumprimento');
  classifier.addDocument('tudo bem?', 'cumprimento');
  classifier.addDocument('adeus', 'despedida');
  classifier.addDocument('até mais', 'despedida');
  classifier.addDocument('tchau', 'despedida');
  classifier.addDocument('obrigado', 'agradecimento');
  classifier.addDocument('muito obrigado', 'agradecimento');
  classifier.addDocument('obrigada', 'agradecimento');
  classifier.train();

  const label = classifier.classify(text);

  // Envia a resposta apropriada
  switch (label) {
    case 'cumprimento':
      await msg.reply('Olá! Tudo bem com você?');
      break;
    case 'despedida':
      await msg.reply('Até logo! Foi bom conversar com você.');
      break;
    case 'agradecimento':
      await msg.reply('Por nada! Sempre que precisar, é só chamar.');
      break;
    default:
      await msg.reply('Desculpe, não entendi o que você quis dizer.');
      break;
  }
});

// Conecta o cliente do WhatsApp
client.initialize();