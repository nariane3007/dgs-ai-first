/**
 * app.js — DB1 Faturamento App v2
 * Orchestrates two skills via Flask backend:
 *   Etapa 1 → POST /api/faturamento  → skill: db1-faturamento-html
 *   Etapa 2 → POST /api/relatorio    → skill: db1-report-transform
 */

const App = (() => {
  let state = {
    step: 1,
    file: null,
    reportHtml: null,
    reportBlob: null,
  };

  const $ = id => document.getElementById(id);

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    setupUpload();
    setupButtons();
    setStep(1);
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  function setupUpload() {
    const zone  = $('uploadZone');
    const input = $('fileInput');

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('drag-over');
      handleFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', e => handleFile(e.target.files[0]));
  }

  function handleFile(file) {
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast('Formato inválido. Use .xlsx, .xls ou .csv', 'error'); return;
    }
    state.file = file;
    $('fileName').textContent = file.name;
    $('fileSize').textContent = fmtBytes(file.size);
    $('fileSelected').classList.add('show');
    $('uploadZone').style.display = 'none';
    $('btnGerarFaturamento').disabled = false;
    toast(`Arquivo "${file.name}" carregado ✓`);
  }

  // ── Buttons ───────────────────────────────────────────────────────────────
  function setupButtons() {
    $('btnNovoArquivo').addEventListener('click', resetFile);
    $('btnGerarFaturamento').addEventListener('click', etapa1);
    $('btnVoltar').addEventListener('click', () => setStep(1));
    $('btnExportar').addEventListener('click', etapa2);
    $('btnAbrirHtml')?.addEventListener('click', abrirHtmlNovaAba);
  }

  // ── Etapa 1 — skill: db1-faturamento-html ────────────────────────────────
  async function etapa1() {
    if (!state.file) { toast('Selecione um arquivo primeiro.', 'warn'); return; }

    showProcessing('Gerando Faturamento...', 'Executando skill /db1-faturamento-html');

    const form = new FormData();
    form.append('file',        state.file);
    form.append('col_total',   $('colTotal').value   || 'TOTAL');
    form.append('col_area',    $('colArea').value    || 'Cod. Area');
    form.append('col_projeto', $('colProjeto').value || 'Cód. Equipe Responsável');
    form.append('col_resp',    $('colResp').value    || 'Cód. Responsavel');

    try {
      const res  = await fetch('/api/faturamento', { method: 'POST', body: form });
      const data = await res.json();
      hideProcessing();

      if (!res.ok || data.error) {
        toast(data.error || 'Erro ao processar.', 'error');
        if (data.detail) console.error('[db1-faturamento-html]', data.detail);
        return;
      }

      // Display HTML inside iframe via Blob URL
      state.reportHtml = data.html;
      const blob = new Blob([data.html], { type: 'text/html;charset=utf-8' });
      state.reportBlob = URL.createObjectURL(blob);

      $('reportFrame').src = state.reportBlob;
      $('reportSubtitle').textContent = `Gerado pela skill /db1-faturamento-html — ${state.file.name}`;
      $('btnAbrirHtml').style.display = '';

      setStep(2);
      toast('Relatório de faturamento gerado com sucesso! ✓');

    } catch (err) {
      hideProcessing();
      toast('Erro de comunicação com o servidor. O backend está rodando?', 'error');
      console.error(err);
    }
  }

  // ── Etapa 2 — skill: db1-report-transform ────────────────────────────────
  async function etapa2() {
    if (!state.file) { toast('Arquivo não encontrado. Volte ao passo 1.', 'warn'); return; }

    showProcessing('Gerando Planilha de Detalhes...', 'Executando skill /db1-report-transform');

    const form = new FormData();
    form.append('file', state.file);

    try {
      const res = await fetch('/api/relatorio', { method: 'POST', body: form });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        hideProcessing();
        toast(err.error || 'Erro ao gerar planilha.', 'error');
        if (err.detail) console.error('[db1-report-transform]', err.detail);
        return;
      }

      // Trigger download
      const blob     = await res.blob();
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement('a');
      const fileName = `Relatorio_DB1_${today()}.xlsx`;
      a.href         = url;
      a.download     = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      hideProcessing();
      toast(`Planilha "${fileName}" baixada com sucesso! ✓`);

    } catch (err) {
      hideProcessing();
      toast('Erro de comunicação com o servidor. O backend está rodando?', 'error');
      console.error(err);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function abrirHtmlNovaAba() {
    if (state.reportBlob) window.open(state.reportBlob, '_blank');
  }

  function setStep(n) {
    state.step = n;
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    $(`step${n}`)?.classList.add('active');

    document.querySelectorAll('.step').forEach(el => {
      const sn = parseInt(el.dataset.step);
      el.classList.remove('active', 'completed');
      if (sn === n)    el.classList.add('active');
      else if (sn < n) el.classList.add('completed');
    });

    const div = $('divider1');
    if (div) div.classList.toggle('done', n > 1);
  }

  function resetFile() {
    state.file = null;
    $('fileInput').value = '';
    $('fileSelected').classList.remove('show');
    $('uploadZone').style.display = '';
    $('btnGerarFaturamento').disabled = true;
    if (state.reportBlob) { URL.revokeObjectURL(state.reportBlob); state.reportBlob = null; }
  }

  function showProcessing(title = 'Processando...', sub = 'Aguarde') {
    $('processingMsg').textContent = title;
    $('processingSub').textContent = sub;
    $('processingOverlay').classList.add('show');
  }

  function hideProcessing() {
    $('processingOverlay').classList.remove('show');
  }

  function toast(msg, type = 'success') {
    const icons = { success: '✅', error: '❌', warn: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast${type === 'error' ? ' error' : type === 'warn' ? ' warn' : ''}`;
    el.innerHTML = `<span>${icons[type] || '✅'}</span><span>${msg}</span>`;
    $('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  function fmtBytes(b) {
    if (b < 1024)       return b + ' B';
    if (b < 1024*1024)  return (b/1024).toFixed(1) + ' KB';
    return (b/1024/1024).toFixed(1) + ' MB';
  }

  function today() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
