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

    if (!channel) return interaction.reply(lang.play.semCanal)

    if (!play) {
      const player = interaction.client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: true
      })
      if (!channel.joinable) { return interaction.reply(lang.play.semPerm) }
      await player.connect()
    }
    const player = interaction.client.manager.players.get(interaction.guild.id)

    if (!player.voiceChannel === channel.id) { return interaction.reply(lang.play.tocandoJa) }

    const search = interaction.options.getString('query')
    let res

    try {
      res = await player.search(search, interaction.author)
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy()
        throw new Error(res.exception.message)
      }
    } catch (err) {
      return interaction.reply(`${lang.play.erro}: ${err.message}`)
    }

    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy()
        return interaction.reply(lang.play.semResultado)

      case 'TRACK_LOADED':
        player.set('interaction', interaction)
        player.queue.add(res.tracks[0])
        if (!player.playing && !player.paused && !player.queue.size) player.play()
        const embed = new MessageEmbed()
        embed.setTimestamp()
        embed.setColor(interaction.guild.me.roles.highest.color)
        embed.setDescription(`**${lang.play.musgaAdd}** \`${res.tracks[0].title}\`\n**${lang.play.duracao}:** \`${this.client.utils.time(res.tracks[0].duration)}\``)
        embed.setFooter(`${lang.play.solicitado} ${res.tracks[0].requester.tag}`, `${res.tracks[0].requester.displayAvatarURL({ dynamic: true, size: 2048 })}`)
        interaction.reply({ embeds: [embed] })
        return

      case 'PLAYLIST_LOADED':
        player.set('interaction', interaction)
        player.queue.add(res.tracks)
        if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play()
        const embed2 = new MessageEmbed()
        embed2.setTimestamp()
        embed2.setColor(interaction.guild.me.roles.highest.color)
        embed2.setDescription(`**${lang.play.playlist}** \`${res.playlist.name}\` **${lang.play.com}** \`${res.tracks.length}\` **${lang.play.musicas}**\n**${lang.play.duracao}:** \`${this.client.utils.time(res.playlist.duration)}\``)
        embed2.setFooter(`${lang.play.solicitado} ${res.tracks[0].requester.tag}`, `${res.tracks[0].requester.displayAvatarURL({ dynamic: true, size: 2048 })}`)
        return interaction.reply({ embeds: [embed2] })

      case 'SEARCH_RESULT':
        player.set('interaction', interaction)
        await player.queue.add(res.tracks[0])
        if (!player.playing && !player.paused && !player.queue.length) player.play()
        const embed4 = new MessageEmbed()
        embed4.setColor(interaction.guild.me.roles.highest.color)
        embed4.setFooter(`${lang.play.solicitado} ${res.tracks[0].requester.tag}`, `${res.tracks[0].requester.displayAvatarURL({ dynamic: true, size: 2048 })}`)
        embed4.setDescription(`**${lang.play.fila}** \`${res.tracks[0].title}\` **${lang.play.fila2}** \n**${lang.play.duracao}:** \`${this.client.utils.time(res.tracks[0].duration)}\``)
        interaction.reply({ embeds: [embed4] })
    }
  }
}
