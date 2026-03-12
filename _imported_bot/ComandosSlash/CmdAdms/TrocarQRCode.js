const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { updateMessageConfig } = require("../../FunctionsAll/BotConfig");
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
    name: "trocarqrcode",
    description: "[🛠|💎 Vendas PREMIUM] Trocar QRCode",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'novafoto',
            description: 'Qual foto ficará no seu QRCode?',
            type: Discord.ApplicationCommandOptionType.Attachment,
            required: true
        },
    ],

    run: async (client, interaction, message) => {
        return interaction.reply({ content: `❌ | Comando desativado.`, ephemeral: true })
        await interaction.reply({ content: `${obterEmoji(10)} Aguarde...`, ephemeral: true })
        let config = {
            method: 'GET',
            headers: {
                'Authorization': 'SUASENHA'
            }
        };
        const ddddd = await fetch(`http://suarota.com/permissions/${client.user.id}`, config)
        const info = await ddddd.json()
        if (info.Error == "Nenhum BOT encontrado nesse ID!") return interaction.editReply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
        const ggg = info.users
        if (!ggg.includes(interaction.user.id)) return interaction.editReply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })


        const arq = interaction.options.getAttachment('novafoto');
        const dddddd = await fetch(`http://apivendas.squareweb.app/api/v1/adicionais/${client.user.id}`, config)
        const info2 = await dddddd.json()
        // if (info2?.adicionais?.QRCodePersonalizavel !== true) {
        //     interaction.editReply({ content: `❌ | Você não possui permissão para usar esse comando. (Adquira no DISCORD DA STORM APPS)`, ephemeral: true })
        //     return
        // }
        const minhaString = arq.name

        if (minhaString.includes(".png")) {
            try {
                const axios = require('axios');
                const path = require('path');
                const fs = require('fs').promises;
                const nomeDoDiretorio = 'Lib';
                const caminhoDoDiretorio = path.resolve(__dirname, '..', '..', nomeDoDiretorio);

                const response = await axios.get(arq.attachment, { responseType: 'arraybuffer' });

                const caminhoNoComputador = path.join(caminhoDoDiretorio, 'aaaaa.png');
                await fs.writeFile(caminhoNoComputador, Buffer.from(response.data));

                interaction.editReply({ content: `✅ | QRCode trocado com sucesso!`, ephemeral: true })
            } catch (error) {
                interaction.editReply({ content: `❌ | Erro ao trocar o QRCode.`, ephemeral: true })
            }




        } else {
            interaction.editReply({ content: `❌ | O arquivo precisa ser .png`, ephemeral: true })
        }


    }
}