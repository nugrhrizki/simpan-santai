import { TextInput } from "./components/text-input";
import "./styles/index.css";
import { html, render } from "./lib/dom";
import { formatNumber, mask, normalizeNumber } from "./utils/format";
import { ceilTo500 } from "./utils/math";
import { createEffect, createSignal } from "./lib/signal";

function Hasil({ label, value }) {
  return html`
    ${TextInput({
      label,
      id: "hasil",
      placeholder: "Hasil",
      pre: "Rp",
      value,
    })}
  `;
}

function App() {
  const [target, setTarget] = createSignal(0);
  const [bulan, setBulan] = createSignal(0);
  const [hasil, setHasil] = createSignal("");

  createEffect(() => {
    if (!isNaN(target()) && !isNaN(bulan()) && bulan() > 0) {
      setHasil(
        formatNumber(ceilTo500(parseInt(target() / bulan())).toString()),
      );
    }
  });

  return html`
    <div class="container my-8">
      <h1>Kalkulator Menabung Bulanan</h1>
      <div class="grid">
        ${TextInput({
          placeholder: "Target",
          onInput(e) {
            setTarget(normalizeNumber(e.target.value));
            mask(e.target, formatNumber);
          },
          label: "Target Akhir Tabungan:",
          id: "target",
          pre: "Rp",
        })}
        ${TextInput({
          placeholder: "Bulan",
          label: "Bulan:",
          onInput(e) {
            setBulan(normalizeNumber(e.target.value));
            mask(e.target, formatNumber);
          },
          id: "bulan",
          post: "Bulan",
        })}
      </div>
      ${Hasil({
        label: html`Jumlah yang perlu ditabung jika ingin mendapatkan Rp.
        ${() => formatNumber(target().toString())} dalam
        ${() => formatNumber(bulan().toString())} bulan:`,
        value: hasil,
      })}
    </div>
  `;
}

render(App(), "#app");
