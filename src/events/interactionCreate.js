const { MessageEmbed } = require('discord.js')
const Event = require('../interfaces/Event')
const logger = require('../modules/logger')

module.exports = class extends Event {
  async run (interaction) {
    if (!interaction.isCommand()) return

    await interaction.deferReply()

    if (!this.client.commands.has(interaction.commandName)) return

    let lang = this.client.db.get(interaction.guild.id) || 'en'

    const checks = this.client.db.get(interaction.guild.id) || 'pt'

    const ptbr = JSON.parse(JSON.stringify(this.client.lang.pt))
    const enus = JSON.parse(JSON.stringify(this.client.lang.en))

    switch (lang.toLowerCase()) {
      case 'pt':
        lang = ptbr
        break
      case 'en':
        lang = enus
        break
      default:
        lang = enus
        break
    }

    if (!interaction.guild) {
      const embed = new MessageEmbed()
        .setDescription(lang.interaction.dm)
        .setColor(this.client.colors.error)
      return interaction.reply({ embeds: [embed] })
    }

    const command = this.client.commands.get(interaction.commandName)

    if (process.env.NODE_ENV === 'development' && !this.client.utils.checkOwner(interaction.user.id)) {
      const embed = new MessageEmbed()
        .setDescription(lang.message.manutencao)
        .setColor(this.client.colors.error)
      return interaction.reply({ embeds: [embed] })
    }

    if (command.ownerOnly && !this.client.utils.checkOwner(interaction.user.id)) {
      const embed = new MessageEmbed()
        .setDescription(lang.message.dono)
        .setColor(this.client.colors.error)
      return interaction.editReply({ embeds: [embed] })
    }

    if (!command.enabled) {
      const embed = new MessageEmbed()
        .setDescription(lang.message.desabilitado)
        .setColor(this.client.colors.error)
      return interaction.editReply({ embeds: [embed] })
    }

    if (command.nsfw && !interaction.channel.nsfw) {
      const embed = new MessageEmbed()
        .setDescription(lang.message.nsfw)
        .setColor(this.client.colors.error)
      return interaction.editReply({ embeds: [embed] })
    }

    const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms
    if (userPermCheck && !this.client.utils.checkOwner(interaction.user.id)) {
      const missing = interaction.channel.permissionsFor(interaction.member).missing(userPermCheck)
      if (missing.length) {
        const embed = new MessageEmbed()
          .setDescription(`${lang.message.userPerms} \`${checks === 'en' ? this.client.utils.formatArray(missing.map(this.client.utils.formatPerms)) : this.client.utils.formatArray2(missing.map(this.client.utils.formatPerms))}\` ${lang.message.userPerms2}`)
          .setColor(this.client.colors.error)
        return interaction.editReply({ embeds: [embed] })
      }
    }

    const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms
    if (botPermCheck) {
      const missing = interaction.channel.permissionsFor(this.client.user).missing(botPermCheck)
      if (missing.length) {
        const embed = new MessageEmbed()
          .setDescription(`${lang.message.botPerm} \`${checks === 'en' ? this.client.utils.formatArray(missing.map(this.client.utils.formatPerms)) : this.client.utils.formatArray2(missing.map(this.client.utils.formatPerms))}\` ${lang.message.botPerm2}`)
          .setColor(this.client.colors.error)
        return interaction.editReply({ embeds: [embed] })
      }
    }

    let response = false

    interaction.author = interaction.user

    interaction.reply = async (c, o) => {
      if (!response) {
        response = true
        return interaction.editReply(c, o)
      } else {
        return this.client.channels.cache.get(interaction.channel.id).send(c, o)
      }
    }

    interaction.edit = async (c, o) => {
      if (!response) {
        response = true
        return interaction.editReply(c, o)
      } else {
        return this.client.channels.cache.get(interaction.channel.id).send(c, o)
      }
    }

    try {
      await command.run(interaction, lang)
    } catch (error) {
      logger.error(4, error)
      this.sentry.captureException(error)
      const embed = new MessageEmbed()
        .setDescription('There was an error while executing this command!')
        .setColor(this.client.colors.error)
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }
  }
}
