const { SlashCommandBuilder } = require("discord.js");
const User = require("../../db/db-connect.js");

// Export an object with a "data" property that defines a SlashCommandBuilder object
// with the name and description of the slash command
module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-pogocode")
    .setDescription("Delete your Pokemon Go friend code from the bot"),

  // An async function that handles the execution of the slash command
  async execute(interaction) {
    // Defer the reply to the interaction with the "ephemeral" flag set to true to hide the reply from other users.
    await interaction.deferReply({ ephemeral: true });

    // Get the user ID and user tag from the interaction
    const userId = interaction.user.id;
    const handle = interaction.user.tag;

    // Find the user record in the database
    const friendcode = await User.findOne({ where: { handle: handle } });

    // Update the user record in the database to set their friend code to null
    const deleteCode = await User.update(
      { friend_code: null },
      { where: { handle: handle } }
    );

    try {
      // If the user has a friend code, edit the reply with a success message
      if (friendcode !== null && friendcode.get("friend_code") !== null) {
        if (deleteCode !== 0) {
          return await interaction.editReply({
            content: `Pokemon Go friend code for <@${userId}> deleted!`,
            ephemeral: true,
          });
        }
      } else {
        // If the user doesn't have a friend code, edit the reply with a message indicating so
        await interaction.editReply({
          content: `No Pokemon Go friend code found for <@${userId}> <:ttar:711069119184764928>`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
