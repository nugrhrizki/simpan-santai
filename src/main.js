import "./styles/index.css";
import { html, listen, onMount, render, setValue } from "./utils/dom";
import { formatNumber, mask, normalizeNumber } from "./utils/format";
import { ceilTo500 } from "./utils/math";
import { createEffect, createSignal } from "./utils/signal";

const [target, setTarget] = createSignal(0);
const [bulan, setBulan] = createSignal(0);
const [hasil, setHasil] = createSignal(0);

createEffect(() => {
  if (!isNaN(target()) && !isNaN(bulan()) && bulan() > 0) {
    setHasil(parseInt(target() / bulan()));
  }
});

function handleInputTarget(e) {
  setTarget(normalizeNumber(e.target.value));
  mask(e.target, formatNumber);
}

function handleInputBulan(e) {
  setBulan(normalizeNumber(e.target.value));
  mask(e.target, formatNumber);
}

onMount(() => {
  listen("#target", "input", handleInputTarget);
  listen("#bulan", "input", handleInputBulan);

  createEffect(() => {
    setValue("#hasil", formatNumber(ceilTo500(hasil()).toString()));
  });
});

function Hasil({ label, children }) {
  return html`
    <label for="bulan">
      ${label} jika ingin mendapatkan Rp.
      ${() => formatNumber(target().toString())} dalam
      ${() => formatNumber(bulan().toString())} bulan:
      <div class="flex w-full">
        <div class="pre-input">Rp</div>
        <input id="hasil" />
      </div>
    </label>
    ${children()}
  `;
}

function Anak() {
  return html`<p>Aku adalah anak</p>`;
}

function App() {
  const [count, setCount] = createSignal(0);

  setInterval(() => setCount(count() + 1), 1000);

  return html`
    <div class="container my-8">
      <h1>Kalkulator Menabung Bulanan ${count}</h1>
      <div class="grid">
        <label for="target">
          Target Akhir Tabungan:
          <div class="flex w-full">
            <div class="pre-input">Rp</div>
            <input id="target" />
          </div>
        </label>
        <label for="bulan">
          Bulan:
          <div class="flex w-full">
            <input id="bulan" />
            <div class="post-input">Bulan</div>
          </div>
        </label>
      </div>
      ${Hasil({
        label: "Jumlah yang perlu ditabung",
        children: Anak,
      })}
    </div>
  `;
}

render(App(), "#app");
