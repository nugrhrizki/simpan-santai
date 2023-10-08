import { createEffect } from "./signal";

const nodes = new Map();
const reactiveFns = new Map();
const events = new Map();
const reactiveProps = new Map();
let nodeIndex = 0;
let reactiveIndex = 0;
let eventIndex = 0;
let reactivePropIndex = 0;

export function html(templates, ...props) {
  let raw = templates.raw,
    markup = "",
    i = 0,
    len = arguments.length,
    str,
    variable;

  console.log(raw, props);

  while (i < len) {
    str = raw[i];
    str = str.replace(/\s+/g, " ");
    str = str.replace(/<!--.*?-->/g, "");

    const matches = str.match(/(@|:)(\w+)=/g);
    if (matches) {
      for (const match of matches) {
        // if match is start with @, then it's an event
        if (match.startsWith(":")) {
          if (typeof props[i] === "function") {
            const id = `reactive-prop-${++reactivePropIndex}`;
            const prop = match.slice(1, -1);
            reactiveProps.set(id, {
              prop,
              value: props[i],
            });
            str = str.replace(match, `data-reactive-prop-id="${id}"`);
          } else {
            str = str.replace(match, "");
          }
        } else if (match.startsWith("@")) {
          const id = `event-${++eventIndex}`;
          const type = match.slice(1, -1);
          events.set(id, {
            type,
            fn: props[i],
          });
          str = str.replace(match, `data-event-id="${id}"`);
        }
      }
      const next = raw[i + 1];
      if (!next.match(/(@|:)(\w+)=/g)) {
        str += next;
        i++;
      }
      markup += str;
      i++;
      continue;
    } else {
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

  const eventElements = fragment.querySelectorAll("[data-event-id]");
  for (const eventElement of eventElements) {
    const id = eventElement.getAttribute("data-event-id");
    if (events.has(id)) {
      let { type, fn } = events.get(id);
      eventElement.addEventListener(type, fn);
    }
  }

  const reactivePropElements = fragment.querySelectorAll(
    "[data-reactive-prop-id]",
  );
  for (const reactivePropElement of reactivePropElements) {
    const id = reactivePropElement.getAttribute("data-reactive-prop-id");
    if (reactiveProps.has(id)) {
      let { prop, value } = reactiveProps.get(id);
      createEffect(() => {
        reactivePropElement[prop] = value();
      });
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
