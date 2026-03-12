const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { updateMessageConfig } = require("../../FunctionsAll/BotConfig");
const { StartConfigCupom } = require("../../FunctionsAll/Cupom");

module.exports = {
  name: "configcupom",
  description: "[🛠|💰 Vendas Moderação] Configure um cupom",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
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
 

    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum cupom registrado em seu BOT`, ephemeral: true })
    StartConfigCupom(interaction, client, interaction.user.id, interaction.options._hoistedOptions[0].value)

  }
}