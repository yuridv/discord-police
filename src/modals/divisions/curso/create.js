const { MessageFlags, EmbedBuilder, ButtonStyle, TextDisplayBuilder } = require('discord.js');

const { Errors, Validate, Container } = require('../../../utils/functions');
const emojis = require('../../../../emojis.json');
const config = require('../../../../config.json');

const Modal = async(client, modal) => {
  try {
    const channel = modal.guild.channels.cache.get(config.divisions.channels.curso.approve);
    if (!channel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *${modal.author || modal.user}, O canal de solicitações de curso configurado não foi encontrado!*`);

      return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `${modal.author || modal.user}` });
    }

    const camps = {
      'passport': { type: 'number', required: true, guild: modal.guild },
      'name': { type: 'string', required: true },
      'phone': { type: 'number', required: true, max: 6 },
      'division': { type: 'string', required: true },
      'date': { type: 'date_hour', required: true }
    };

    const values = {};
    for (const id in camps) {
      const component = modal.components.find(c => c?.component?.customId === id)?.component;
      if (!component) continue;

      if (component.attachments?.first()?.url) {
        values[id] = component.attachments?.first()?.url;
      } else if (component.values) {
        values[id] = component.values[0];
      } else {
        values[id] = component.value;
      }
    }

    const validate = await Validate(values, camps)
      .catch((e) => e);

    if (validate?.errors?.length >= 1) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(validate.errors.map((e) => `${emojis.error} • ${e}`).join('\n'));

      return modal.reply({ content: `<@${modal.user.id}>`, embeds: [ embed ], flags: MessageFlags.Ephemeral });
    }

    const roles_division = config.divisions.roles.register.unidades[values.division];

    if (
      [ roles_division[0] ]
        .some((role) => modal.member.roles.cache.has(role))
    ) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Você já faz parte da* ***Divisão*** *selecionada!*`);

      return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${modal.member.id}>` });
    }

    let phone = values?.phone;
    if (phone?.length <= 3) {
      phone = phone.padStart(3, '0');
    } else if (phone?.length === 6) {
      phone = phone.replace(/^(\d{3})(\d{3})$/, '$1-$2');
    }

    const items = [
      {
        type: 'textDisplay',
        title: `# ${emojis.clipboard} ・ *Solicitação de Curso*`,
        description: '*Nesse registro contem os dados da solicitação de curso do oficial.*'
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.pencil} ・ ***Informações do Solicitante:***` +
          `\n ・ **Usuário:** <@${modal.user.id}>` +
          `\n ・ **Nome:** ${values?.name}` +
          `\n ・ **Passaporte:** ${values?.passport}`
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          `\n\n> ### ${emojis.handcuffs} ・ ***Informações da Solicitação:***` +
          `\n ・ **Divisão Solicitada:** <@&${roles_division[0]}>` +
          `\n ・ **Data Solicitada:** ${values?.date}`
      },
      { type: 'separator' },
      {
        type: 'image',
        image: config.banner_city
      },
      { type: 'separator' },
      {
        type: 'buttons',
        buttons: [
          {
            id: `divisions/curso/approve-${modal.user.id}-${values.division}-${values.battalion}-${values.name}-${values.passport}`,
            emoji: emojis.success,
            label: 'Marcar Curso',
            style: ButtonStyle.Success
          },
          {
            id: `divisions/curso/deny-${modal.user.id}-${values.division}`,
            emoji: emojis.error,
            label: 'Rejeitar Curso',
            style: ButtonStyle.Danger
          }
        ]
      }
    ];

    const container = await Container(items, '#FFFF00');
    const mentionsTextDisplay = new TextDisplayBuilder()
      .setContent(
        `|| <@&${roles_division[roles_division.length - 1]}> <@&${roles_division[roles_division.length - 2]}> <@&${roles_division[roles_division.length - 3]}> <@&${roles_division[roles_division.length - 4]}> ||`
      );

    await channel.send({
      components: [ mentionsTextDisplay, container ],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [ 'users' ], roles: roles_division.slice(-4) }
    });

    await modal.member.roles.add(config.divisions.roles.register.waiting).catch(() => {});

    const embedSuccess = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(`${emojis.success} • *A sua solicitação foi enviado com sucesso!*\n> *Aguarde até que um de nossos instrutores possa marcar o seu curso em <#${channel.id}>!*`);

    return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embedSuccess ], content: `${modal.author || modal.user}` });
  } catch (err) {
    return Errors(err, `Modal ${__filename}`)
      .then(() => Modal(client, modal))
      .catch(e => modal.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: Modal };