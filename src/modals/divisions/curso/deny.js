const { MessageFlags, EmbedBuilder, SeparatorBuilder, TextDisplayBuilder } = require('discord.js');

const { Errors, Validate, extractName } = require('../../../utils/functions');
const emojis = require('../../../../emojis.json');

const Modal = async(client, modal, args) => {
  try {
    const [ userId ] = args;

    const camps = {
      'reason': { type: 'string', required: true }
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

    const container = modal.message.components[1];
    container.data.accent_color = parseInt(('#FF0000').replace('#', ''), 16);
    container.components[0].data.content = `# ${emojis.error} ・ *Curso Reprovado*\n*Nesse registro contem os dados da solicitação de curso de um oficial.*`;

    const { passport, name } = extractName(modal.member.nickname);
    if (!passport || !name) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O seu nome não possui um passaporte valido para efetuar essa ação.*`);

      return modal.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${modal.member.id}>` });
    }

    container.components.splice(5, 0,
      new SeparatorBuilder(),
      new TextDisplayBuilder()
        .setContent(
          `\n\n> ### ${emojis.success} ・ ***Solicitação Reprovado Por:***` +
          `\n ・ **Usuário:** <@${modal.user.id}>` +
          `\n ・ **Nome:** ${name}` +
          `\n ・ **Passaporte:** ${passport}` +
          `\n ・ **Motivo:** *${values.reason}*`
        )
    );

    container.components.pop();
    container.components.pop();

    await modal.message.edit({ components: [ container ] });

    const embedSuccess = new EmbedBuilder()
      .setColor('#FFAA00')
      .setDescription(`${emojis.success} • *A solicitação do oficial <@${userId}> foi* ***REPROVADA*** *com sucesso!*`);

    return modal.reply({ embeds: [ embedSuccess ], content: `${modal.author || modal.user} <@${userId}>` })
      .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 15000));
  } catch (err) {
    return Errors(err, `Modal ${__filename}`)
      .then(() => Modal(client, modal))
      .catch(e => modal.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: Modal };