import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ActionRowBuilder,
  AttachmentBuilder,
  BaseInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
} from 'discord.js';

export interface FollowUpProps {
  content?: string;
  embeds?: EmbedBuilder[];
  components?: ActionRowBuilder[];
  files?: AttachmentBuilder[];
  ephemeral?: boolean;
  buttonReply?: boolean;
  selectMenuReply?: boolean;
}

export type FollowUpType = (
  interaction: BaseInteraction,
  props: FollowUpProps
) => Promise<Message | InteractionResponse | undefined>;

/**
 * An adaptable version of interaction.followUp() to follow up any interaction after a defer.
 * @param interaction The interaction to followup.
 * @param props The properties to followup the interaction with.
 * @param props.content The content to followup the interaction with.
 * @param props.embeds The embeds to followup the interaction with.
 * @param props.components The components to followup the interaction with.
 * @param props.files The files to followup the interaction with.
 * @param props.ephemeral Whether the interaction should be ephemeral.
 * @param props.buttonReply Whether the interaction is a button reply.
 * @param props.selectMenuReply Whether the interaction is a select menu reply.
 * @returns The followed up interaction.
 */
export default async (
  interaction: BaseInteraction,
  props: FollowUpProps
): Promise<Message | InteractionResponse | undefined> => {
  const newProps = {
    content: props.content ?? '',
    embeds: props.embeds ?? [],
    components:
      (props.components as unknown as
        | APIActionRowComponent<APIMessageActionRowComponent>[]
        | undefined) ?? [],
    files: props.files ?? [],
    ephemeral: props.ephemeral ?? false,
  };

  if (props.buttonReply && interaction.isButton())
    return interaction.followUp(newProps);

  if (
    props.selectMenuReply &&
    (interaction.isStringSelectMenu() ||
      interaction.isChannelSelectMenu() ||
      interaction.isRoleSelectMenu())
  )
    return interaction.followUp(newProps);

  if (interaction.isChatInputCommand() || interaction.isModalSubmit())
    return interaction.followUp(newProps);

  if (interaction.isButton()) return interaction.editReply(newProps);

  if (
    interaction.isStringSelectMenu() ||
    interaction.isChannelSelectMenu() ||
    interaction.isRoleSelectMenu()
  )
    return interaction.editReply(newProps);

  return undefined;
};
