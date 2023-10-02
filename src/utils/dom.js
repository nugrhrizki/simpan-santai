import { createEffect } from "./signal";

const nodes = new Map();
const reactiveFns = new Map();
let nodeIndex = 0;
let reactiveIndex = 0;

export function html(templates, ...props) {
  let raw = templates.raw,
    markup = "",
    i = 0,
    len = arguments.length,
    str,
    variable;

  while (i < len) {
    str = raw[i];
    if (typeof props[i] === "function") {
      const id = `reactive-${++reactiveIndex}`;
      reactiveFns.set(id, props[i]);
      variable = `<script reactive="${id}"></script>`;
    } else if (props[i]?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      const id = `node-${++nodeIndex}`;
      nodes.set(id, props[i]);
      variable = `<script node="${id}"></script>`;
    } else {
      variable = props[i];
    }
    if (variable !== undefined) {
      markup += str + variable;
    } else {
      markup += str;
    }
    i++;
  }

  return createDOM(markup);
}

function createDOM(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content.cloneNode(true);
  const reactives = fragment.querySelectorAll("[reactive]");
  for (const reactive of reactives) {
    const id = reactive.getAttribute("reactive");
    if (reactiveFns.has(id)) {
      const fn = reactiveFns.get(id);
      const textNode = document.createTextNode(fn());
      reactive.parentNode.replaceChild(textNode, reactive);
      createEffect(() => {
        textNode.textContent = fn();
      });
    }
  }
  const nodesElement = fragment.querySelectorAll("[node]");
  for (const node of nodesElement) {
    const id = node.getAttribute("node");
    if (nodes.has(id)) {
      const fragment = nodes.get(id);
      node.parentNode.replaceChild(fragment, node);
    }
  }
  return fragment;
}

export function render(element, target, options = "append") {
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof target === "string") {
      target = document.querySelector(target);
    }

    if (target === null) {
      return;
    }

    if (options === "append") {
      target.appendChild(element);
    } else if (options === "prepend") {
      target.prepend(element);
    } else if (options === "replace") {
      target.replaceWith(element);
    } else if (options === "before") {
      target.before(element);
    } else if (options === "after") {
      target.after(element);
    }

    document.dispatchEvent(new Event("html:loaded"));
  });
}

export function onMount(fn) {
  document.addEventListener("html:loaded", fn);
}

export function listen(target, event, fn) {
  if (typeof target === "string") {
    target = document.querySelectorAll(target);
  }
  if (target === null) {
    return;
  }
  for (const el of target) el.addEventListener(event, fn);
}

export function setValue(target, value) {
  if (typeof target === "string") {
    target = document.querySelectorAll(target);
  }
  if (target === null) {
    return;
  }
  for (const el of target) el.value = value;
}
