import { html } from "../lib/dom";

export function TextInput({
  id,
  label,
  type = "text",
  placeholder,
  onInput,
  value,
  pre,
  post,
  readonly,
}) {
  return html`<label for="${id}">
    ${label}
    <div class="flex w-full">
      ${pre ? html`<div class="pre-input">${pre}</div>` : ""}
      <input
        :value=${value}
        type="${type}"
        @input=${onInput}
        placeholder="${placeholder || ""}"
        id="${id}"
        :readonly=${readonly}
      />
      ${post ? html`<div class="post-input">${post}</div>` : ""}
    </div>
  </label>`;
}
