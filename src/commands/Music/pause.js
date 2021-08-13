const Command = require('../../interfaces/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      name: 'pause',
      description: 'Pause the music',
      category: 'Music',
      enabled: true
    })
  }

  async run (interaction, lang) {
    const player = this.client.manager.players.get(interaction.guild.id)

    const { channel } = interaction.member.voice

    if (!player) {
      const embed = new MessageEmbed()
        .setDescription(lang.geral.nada)
        .setColor(this.client.colors.error)
      return interaction.reply({ embeds: [embed] })
    }

    if (!channel) {
      const embed1 = new MessageEmbed()
        .setDescription(lang.geral.naoTa)
        .setColor(this.client.colors.error)
      return interaction.reply({ embeds: [embed1] })
    }

    if (channel.id !== player.voiceChannel) {
      const embed2 = new MessageEmbed()
        .setDescription(lang.geral.mesmo)
        .setColor(this.client.colors.error)
      return interaction.reply({ embeds: [embed2] })
    }

    if (player.paused) {
      const embed3 = new MessageEmbed()
        .setDescription(lang.pause.noPaused)
        .setColor(this.client.colors.error)
      return interaction.reply({ embeds: [embed3] })
    } else if (!player.paused) {
      player.pause(true)
      return interaction.react('⏸️')
    }
  }
}
