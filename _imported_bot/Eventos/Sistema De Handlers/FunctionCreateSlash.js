module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {
        try {
            if (interaction.isChatInputCommand()) {
                const cmd = client.slashCommands.get(interaction.commandName);

                if (!cmd) {
                    return interaction.reply({ content: 'Comando nao encontrado.', ephemeral: true });
                }

                if (!interaction.guild) {
                    return interaction.reply({ content: 'Esse comando so pode ser usado em servidor.', ephemeral: true });
                }

                interaction.member = interaction.guild.members.cache.get(interaction.user.id);
                await cmd.run(client, interaction);
            }

            if (interaction.isMessageContextMenuCommand()) {
                const command = client.slashCommands.get(interaction.commandName);
                if (command) {
                    await command.run(client, interaction);
                }
            }

            if (interaction.isUserContextMenuCommand()) {
                const command = client.slashCommands.get(interaction.commandName);
                if (command) {
                    await command.run(client, interaction);
                }
            }
        } catch (error) {
            console.error('Erro ao executar interactionCreate:', error);

            if (!interaction || !interaction.isRepliable()) {
                return;
            }

            const payload = {
                content: 'O comando falhou por configuracao incompleta do bot. Configure os canais em /botconfig.',
                ephemeral: true
            };

            if (interaction.deferred || interaction.replied) {
                await interaction.followUp(payload).catch(() => null);
                return;
            }

            await interaction.reply(payload).catch(() => null);
        }
    }
};
