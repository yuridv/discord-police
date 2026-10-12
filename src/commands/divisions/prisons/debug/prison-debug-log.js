const { PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

const { Errors } = require('../../../../utils/functions');
const config = require('../../../../../config.json');
const emoji = require('../../../../../emojis.json');

const command = async(client, interaction, args) => {
  try {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(`${emoji.error} • *Você não possui permissão de* __***ADMINISTRADOR***__ *para utilizar esse comando!*`);

      return interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [ embed ] });
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Prisão realizada', iconURL: client.user.displayAvatarURL() })
      .setColor('#2e376e')
      .setFields([
        // spell-checker: disable
        { name: 'Oficial(is)', value: '```ini\n[2860] Dragon Luthor\n[2877] Mel Lysenko```', inline: false },
        { name: 'Prendeu', value: '```ini\n[2237] Danoninho Martinez```', inline: false },
        // spell-checker: enable
        { name: 'Artigos', value: 'Artigo 20 - Desobediência à ordem legal / Resistência à prisão, Artigo 19 - Desacato à autoridade, Artigo 34 - Difamação, Artigo 60 - Porte ilegal de Armamento Pesado', inline: false },
        { name: 'Tempo de prisão', value: '240 meses', inline: true },
        { name: 'Valor em Multas', value: '$200000', inline: true }
      ])
      .setImage('https://media.discordapp.net/attachments/1424170165154611351/1519186335527862352/image.png?ex=6acda907&is=6acc5787&hm=f9ab17ffc544dfa09966c53aca731e1cceb9ce417160486643be382d03af8003&=&format=webp');

    await interaction.guild.channels.cache.get(config.divisions.channels.prisons.logs).send({ embeds: [ embed ] });

    await interaction.reply({ flags: MessageFlags.Ephemeral, content: `${emoji.success} | Log de teste enviado com sucesso!` });
  } catch (err) {
    return Errors(err, `Command ${__filename}`)
      .then(() => command(client, interaction, args))
      .catch((e) => interaction.reply({ content: `${emoji.error} | ` + e.error, flags: MessageFlags.Ephemeral }));
  }
};

module.exports = {
  route: command,
  description: '🐛 [Debug] 🐛 | Comando para simular uma log de prisão.'
};