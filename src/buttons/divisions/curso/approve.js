const {
  MessageFlags,
  EmbedBuilder,
  SeparatorBuilder,
  TextDisplayBuilder
} = require('discord.js');

const { Errors, extractName } = require('../../../utils/functions');

const emojis = require('../../../../emojis.json');

const button = async(client, interaction, args) => {
  try {
    const [ userId, division, battalion, userName, userPassport ] = args;
    if (!userId || !division || !battalion || !userName || !userPassport) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Não foi passado os dados obrigatórios para efetuar essa ação. Reporte ao meu desenvolvedor!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const { passport, name } = extractName(interaction.member.nickname);
    if (!passport || !name) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *O seu nome não possui um passaporte valido para efetuar essa ação.*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ], content: `<@${interaction.member.id}>` });
    }

    const container = interaction.message.components[1] || interaction.message.components[0];
    container.data.accent_color = parseInt(('#00FF00').replace('#', ''), 16);
    container.components[0].data.content = `# ${emojis.success} ・ *Curso Aprovado*\n*Nesse registro contem os dados da solicitação de curso de um oficial.*`;

    container.components.splice(5, 0,
      new SeparatorBuilder(),
      new TextDisplayBuilder()
        .setContent(
          `\n\n> ### ${emojis.success} ・ ***Solicitação Aprovada por:***` +
          `\n ・ **Usuário:** <@${interaction.user.id}>` +
          `\n ・ **Nome:** ${name}` +
          `\n ・ **Passaporte:** ${passport}`
        )
    );

    container.components.pop();
    container.components.pop();

    return interaction.message.edit({ components: [ container ] });
  } catch(err) {
    return Errors(err, `Button ${__filename}`)
      .then(() => button(client, interaction))
      .catch((e) => interaction.reply({ content: e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { route: button };