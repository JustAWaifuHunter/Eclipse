const Command = require('../../interfaces/Command')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      name: 'eval',
      description: 'Run codes',
      category: 'Developer',
      enabled: true,
      ownerOnly: true
    })
  }

  async run (interaction, args) {
    try {
      // eslint-disable-next-line no-eval
      let code = await eval(interaction.options.getString('code'))
      if (typeof code !== 'string') code = await require('util').inspect(code, { depth: 0 })
      interaction.reply(`📩 Input \`\`\`js\n${interaction.options.getString('code')}\`\`\`\n🚩 Exit \`\`\`js\n${code.slice(0, 1010)}\n\`\`\``)
    } catch (err) {
      interaction.reply(`\`\`\`js\n${err}\n\`\`\``)
    }
  }
}
