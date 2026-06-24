const {
  MessageFlags,
  ModalBuilder
} = require('discord.js');

const { Errors, ModalTypes } = require('../../../utils/functions');

const button = async(client, interaction) => {
  try {

    const modal = new ModalBuilder()
      .setCustomId('divisions/curso/create')
      .setTitle('Solicitação de Curso');

    modal.addLabelComponents(
      camps.map((c) => ModalTypes[c.type](c))
    );

    return interaction.showModal(modal);
  } catch(err) {
    return Errors(err, `Button ${__filename}`)
      .then(() => button(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: button };

const camps = [
  { 
    id: 'passport', 
    type: 'text',
    type_text: 'Short', 
    title: 'Passaporte', 
    description: 'Escreva o número do seu passaporte dentro da cidade', 
    placeholder: '344',
    required: true
  },
  {
    id: 'name',
    type: 'text',
    type_text: 'Short', 
    title: 'Nome e Sobrenome',
    description: 'Escreva o seu nome e sobrenome dentro da cidade',
    placeholder: 'Dragon Luthor',
    required: true
  },
  {
    id: 'phone', 
    type: 'text', 
    type_text: 'Short', 
    title: 'Telefone', 
    description: 'Escreva o número do seu telefone dentro da cidade.', 
    placeholder: '123-456'
  },
  {
    id: 'division', 
    type: 'select', 
    title: 'Divisão Solicitada', 
    description: 'Selecione a divisão que você deseja efetuar o curso.', 
    placeholder: 'Selecione a divisão', 
    options: [
      { label: '・SPEED', value: 'speed', emoji: '🚓' },
      { label: '・GRAER', value: 'graer', emoji: '🚁' },
      { label: '・GTM', value: 'gtm', emoji: '🏍️' }
    ],
    max: 1,
    min: 1,
    required: true
  },
  {
    id: 'date',
    type: 'text',
    type_text: 'Short', 
    title: 'Data e Hora',
    description: 'Escreva a data e hora que você deseja efetuar o curso.',
    placeholder: 'DD/MM/AAAA HH:MM',
    required: true
  }
];