/* eslint-disable no-case-declarations */
const Command = require('../../interfaces/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      name: 'play',
      description: 'Play a song in your voice channel',
      options: [{
        name: 'query',
        type: 'STRING',
        description: 'A search term or link',
        required: true
      }],
      category: 'Music',
      enabled: true,
      botPerms: ['CONNECT', 'SPEAK']
    })
  }

  async run (interaction, lang) {
    const play = interaction.client.manager.players.get(interaction.guild.id)

    const { channel } = interaction.member.voice

    if (!channel) {
      const embed = new MessageEmbed()
      embed.setColor(this.client.colors.error)
      embed.setDescription(lang.play.semCanal)
      return interaction.reply({ embeds: [embed] })
    }

    if (!play) {
      const player = interaction.client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: true
      })
      if (!channel.joinable) {
        const embed1 = new MessageEmbed()
        embed1.setColor(this.client.colors.error)
        embed1.setDescription(lang.play.semPerm)
        return interaction.reply({ embeds: [embed1] })
      }
      await player.connect()
    }
    const player = interaction.client.manager.players.get(interaction.guild.id)

    if (!player.voiceChannel === channel.id) {
      const embed2 = new MessageEmbed()
      embed2.setColor(this.client.colors.warning)
      embed2.setDescription(lang.play.tocandoJa)
      return interaction.reply({ embeds: [embed2] })
    }

    const search = interaction.options.getString('query')
    let res

    try {
      res = await player.search(search, interaction.author)
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy()
        throw new Error(res.exception.message)
      }
    } catch (err) {
      const embed3 = new MessageEmbed()
      embed3.setColor(this.client.colors.error)
      embed3.setDescription(`${lang.play.erro} \`${err.message}\``)
      return interaction.reply({ embeds: [embed3] })
    }

    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy()
        const embed4 = new MessageEmbed()
        embed4.setColor(this.client.colors.error)
        embed4.setDescription(lang.play.semResultado)
        return interaction.reply({ embeds: [embed4] })

      case 'TRACK_LOADED':
        player.set('interaction', interaction)
        player.queue.add(res.tracks[0])
        if (!player.playing && !player.paused && !player.queue.size) player.play()
        const embed5 = new MessageEmbed()
        embed5.setColor(this.client.colors.success)
        embed5.setDescription(`${lang.play.musgaAdd} [${res.tracks[0].title}](${res.tracks[0].uri})`)
        if (player.queue.length >= 1) interaction.reply({ embeds: [embed5] })
        return

      case 'PLAYLIST_LOADED':
        player.set('interaction', interaction)
        player.queue.add(res.tracks)
        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()
        const embed6 = new MessageEmbed()
        embed6.setColor(this.client.colors.success)
        embed6.setDescription(`${lang.play.playlist} \`${res.playlist.name}\` ${lang.play.com} \`${res.tracks.length}\` ${lang.play.musicas}`)
        return interaction.reply({ embeds: [embed6] })

      case 'SEARCH_RESULT':
        player.set('interaction', interaction)
        await player.queue.add(res.tracks[0])
        if (!player.playing && !player.paused && !player.queue.length) player.play()
        const embed7 = new MessageEmbed()
        embed7.setColor(this.client.colors.success)
        embed7.setDescription(`${lang.play.fila} [${res.tracks[0].title}](${res.tracks[0].uri})`)
        if (player.queue.length >= 1) interaction.reply({ embeds: [embed7] })
    }
  }
}
