const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { updateMessageConfig } = require("../../FunctionsAll/BotConfig");

module.exports = {
  name: "botconfig",
  description: "[🛠|💰 Vendas Moderação] Configuro o bot",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
     let config = {
      method: 'GET',
      headers: {
        'Authorization': 'SUASENHA'
      }
    };
    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 

    updateMessageConfig(interaction, interaction.user.id, client)
    

  }
}