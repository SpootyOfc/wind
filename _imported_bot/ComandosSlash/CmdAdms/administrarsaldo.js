const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "administrarsaldo",
  description: "[💰| Vendas Moderação] Gerenciar Saldo",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "ação",
      description: "Qual ação deseja realizar?",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
      choices: [{
        name: 'Adicionar',
        value: 'adicionar'
      },
      {
        name: 'Remover',
        value: 'remover'
      },
      ]
    },
    {
      name: "user",
      description: "usuário que vai receber a ação?",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "valor",
      description: "Adicionar ou Remover Qual valor?",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    }
  ],

  run: async (client, interaction, message) => {
    let config = {
      method: 'GET',
      headers: {
        'Authorization': 'SUASENHA'
      }
    };
    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 


    let acao = interaction.options.getString('ação');
    let user = interaction.options.getUser('user');
    let valor = interaction.options.getNumber('valor');

    if (acao == 'adicionar') {
      var u = client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)

      client.db.PagamentosSaldos.set(`${user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)) + Number(valor))

      const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`Saldo adicionado para ${user.username}`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`O <@${user.id}> tinha R$ ${Number(u).toFixed(2)}, foi adicionado R$ ${Number(valor).toFixed(2)}, agora ele está com R$ ${Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)).toFixed(2)}`)
        .setFooter({ text: `Autor: ${interaction.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp()

      interaction.reply({
        embeds: [embed], components: [], ephemeral: true
      })
    } else {
      var u = client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)

      if (valor > u) return interaction.reply({ ephemeral: true, content: `ERROR: O usuário ${user} não possui a quantidade que você remover. ele possui (\`R$ ${Number(u).toFixed(2)}\`)` })

      client.db.PagamentosSaldos.set(`${user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)) - Number(valor))

      const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`Saldo retirado do ${user.username}`)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(`O <@${user.id}> tinha \`R$ ${Number(u).toFixed(2)}\`, foi removido \`R$ ${valor.toFixed(2)}\`, agora ele está com \`R$ ${Number(client.db.PagamentosSaldos.get(`${user.id}.SaldoAccount`)).toFixed(2)}\``)
        .setFooter({ text: `Autor: ${interaction.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp()

      interaction.reply({
        embeds: [embed], components: [], ephemeral: true
      })
    }
  }
}