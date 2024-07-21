import { ButtonBuilder, ButtonStyle, ComponentEmojiResolvable } from 'discord.js';

interface BaseButton {
	label?: string;
	emoji?: ComponentEmojiResolvable;
	disabled?: boolean;
}

export class Button extends ButtonBuilder {
	static primary(props: BaseButton & { custom_id: string }) {
		return new ButtonBuilder({
			style: ButtonStyle.Primary,
			custom_id: props.custom_id,
			label: props.label,
			emoji: props.emoji,
			disabled: props.disabled ?? false,
		});
	}

	static secondary(props: BaseButton & { custom_id: string }) {
		return new ButtonBuilder({
			style: ButtonStyle.Secondary,
			custom_id: props.custom_id,
			label: props.label,
			emoji: props.emoji,
			disabled: props.disabled ?? false,
		});
	}

	static success(props: BaseButton & { custom_id: string }) {
		return new ButtonBuilder({
			style: ButtonStyle.Success,
			custom_id: props.custom_id,
			label: props.label,
			emoji: props.emoji,
			disabled: props.disabled ?? false,
		});
	}

	static danger(props: BaseButton & { custom_id: string }) {
		return new ButtonBuilder({
			style: ButtonStyle.Danger,
			custom_id: props.custom_id,
			label: props.label,
			emoji: props.emoji,
			disabled: props.disabled ?? false,
		});
	}

	static link(props: BaseButton & { url: string }) {
		return new ButtonBuilder({
			style: ButtonStyle.Link,
			label: props.label,
			emoji: props.emoji,
			url: props.url,
		});
	}
}