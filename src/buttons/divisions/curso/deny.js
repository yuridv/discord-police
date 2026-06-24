const {
  MessageFlags,
  EmbedBuilder,
  ModalBuilder
} = require('discord.js');

const { Errors, ModalTypes } = require('../../../utils/functions');

const config = require('../../../../config.json');
const emojis = require('../../../../emojis.json');

const button = async(client, interaction, args) => {
  try {
    const [ userId, division ] = args;
    if (!userId || !division) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Não foi passado os dados obrigatórios para efetuar essa ação. Reporte ao meu desenvolvedor!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const roles_division = config.divisions.roles.register.unidades[division];
    if (
      ![
        roles_division[roles_division.length - 1], // COMANDO
        roles_division[roles_division.length - 2], // SUB-COMANDO
        roles_division[roles_division.length - 3], // SUPERVISOR
        roles_division[roles_division.length - 4]  // INSTRUTOR
      ]
        .some((role) => interaction.member.roles.cache.has(role))
    ) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Você não tem permissão para reprovar esse curso!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const modal = new ModalBuilder()
      .setCustomId(`divisions/curso/deny-${userId}`)
      .setTitle('Rejeitar Curso');

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
    id: 'reason',
    type: 'text',
    type_text: 'Short', 
    title: 'Motivo',
    description: 'Escreva o motivo pelo qual você deseja reprovar essa solicitação de curso.',
    placeholder: 'Motivo',
    required: true
  }
];