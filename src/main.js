import { TextInput } from "./components/text-input";
import "./styles/index.css";
import { html, listen, onMount, render, setValue } from "./lib/dom";
import { formatNumber, mask, normalizeNumber } from "./utils/format";
import { ceilTo500 } from "./utils/math";
import { createEffect, createSignal } from "./lib/signal";

function Hasil({ label, target, bulan }) {
  return html`
    ${TextInput({
      label: html`${label} jika ingin mendapatkan Rp.
      ${() => formatNumber(target().toString())} dalam
      ${() => formatNumber(bulan().toString())} bulan:`,
      id: "hasil",
      placeholder: "Hasil",
      pre: "Rp",
    })}
  `;
}

function App() {
  const [target, setTarget] = createSignal(0);
  const [bulan, setBulan] = createSignal(0);
  const [hasil, setHasil] = createSignal(undefined);

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

  return html`
    <div class="container my-8">
      <h1>Kalkulator Menabung Bulanan</h1>
      <div class="grid">
        ${TextInput({
          placeholder: "Target",
          label: "Target Akhir Tabungan:",
          id: "target",
          pre: "Rp",
        })}
        ${TextInput({
          placeholder: "Bulan",
          label: "Bulan:",
          id: "bulan",
          post: "Bulan",
        })}
      </div>
      ${Hasil({
        label: "Jumlah yang perlu ditabung",
        target,
        bulan,
      })}
    </div>
  `;
}

render(App(), "#app");
