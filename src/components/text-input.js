import { html } from "../lib/dom";

export function TextInput({
  id,
  label,
  type = "text",
  placeholder,
  pre,
  post,
}) {
  return html`<label for="${id}">
    ${label}
    <div class="flex w-full">
      ${pre ? html`<div class="pre-input">${pre}</div>` : ""}
      <input type="${type}" placeholder="${placeholder || ""}" id="${id}" />
      ${post ? html`<div class="post-input">${post}</div>` : ""}
    </div>
  </label>`;
}
