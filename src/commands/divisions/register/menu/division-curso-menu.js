const {
  EmbedBuilder,
  ButtonStyle,
  MessageFlags,
  PermissionFlagsBits
} = require('discord.js');

const { Errors, Container } = require('../../../../utils/functions');

const config = require('../../../../../config.json');
const emojis = require('../../../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emojis.error} • *Você não possui permissão de* __***ADMINISTRADOR***__ *para utilizar esse comando!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const items = [
      {
        type: 'textDisplay',
        title: `# ${emojis.clipboard} ・ *Solicitação de Cursos*`,
        description: '*Esse registro reúne os dados do oficial, para que solicite o curso de uma das divisão.*'
      },
      { type: 'separator' },
      {
        type: 'textDisplay',
        description:
          '\n\n> ### ***Como solicitar um curso?***' +
          '\n***1º*** *Clique no botão abaixo* ***"Solicitar Curso"***' +
          '\n***2º*** *Irá abrir um menu para você preencher os dados*' +
          '\n***3º*** *Você precisará informar seu* ***Nome, Passaporte e Telefone*** *do jogo*' +
          '\n***4º*** *Você precisará selecionar a* ***Divisão*** *desejada*' +
          '\n***5º*** *Você precisará informar a* ***Data e Horário*** *desejado*' +

          '\n\n> ### ***Informações:***' +
          '\n• *Após fazer a sua solicitação de curso, você precisa aguardar até que um dos nossos* ***__Instrutores__*** *aprove o seu horário solicitado!*' +
          `\n• *Você pode acompanhar o status da sua solicitação em <#${config.divisions.channels.curso.approve}>!*` +
          '\n• *O* ***local do curso*** *será escolhido pelo instrutor quando ele aprovar a sua solicitação!*' +
          '\n• *Você terá que comparecer ao local marcado com* ***10 minutos*** *de antecedência!*' +
          '\n• *Caso você não compareça no horário marcado, você precisará solicitar outro curso!*' +

          `\n\n*__Atenciosamente ${client.user.username}__*`
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
            id: 'divisions/curso/create',
            emoji: emojis.clipboard,
            label: 'Solicitar Curso',
            style: ButtonStyle.Primary
          }
        ]
      }
    ];

    const container = await Container(items);

    await interaction.channel.send({
      components: [ container ], flags: MessageFlags.IsComponentsV2
    });

    const embedSuccess = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription(`${emojis.success} • *Mensagem de menu enviada com sucesso!*`);

    return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embedSuccess ] });
  } catch(err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emojis.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = { 
  route: command,
  description: '💬 [Menus] 💬 | Comando para gerar a mensagem de registro das divisões.'
};