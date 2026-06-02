/**
 * app.js — DB1 Billing App — Main controller
 */

const App = (() => {
  // ── State ────────────────────────────────────────────────────────────────
  let state = {
    currentStep: 1,
    file: null,
    rawRows: [],
    billingData: null,
    config: {
      cliente: '',
      periodo: '',
      descricao: '',
    },
    detailFilter: '',
    activeTab: 'projetos',
  };

  // ── DOM refs ─────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    setupUploadZone();
    setupStepNavigation();
    setupConfigForm();
    setupDetailSearch();
    renderStep(1);
  }

  // ── Upload Zone ──────────────────────────────────────────────────────────
  function setupUploadZone() {
    const zone  = $('uploadZone');
    const input = $('fileInput');

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    input.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleFile(file);
    });
  }

  function handleFile(file) {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      showToast('Formato inválido. Use .xlsx, .xls ou .csv', 'error');
      return;
    }

    state.file = file;
    $('fileName').textContent   = file.name;
    $('fileSize').textContent   = formatBytes(file.size);
    $('fileSelected').classList.add('show');
    $('uploadZone').style.display = 'none';

    // Auto-fill cliente from filename
    const basename = file.name.replace(/\.(xlsx|xls|csv)$/i, '').replace(/[-_]/g, ' ');
    if (!state.config.cliente) {
      $('inputCliente').value = basename;
      state.config.cliente    = basename;
    }

    $('btnProcessar').disabled = false;
    showToast(`Arquivo "${file.name}" carregado com sucesso ✓`, 'success');
    readExcel(file);
  }

  function readExcel(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb   = XLSX.read(data, { type: 'array', cellDates: true });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        state.rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        $('rowCount').textContent = `${state.rawRows.length} linhas detectadas`;
      } catch (err) {
        showToast('Erro ao ler o arquivo Excel: ' + err.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // ── Config form ──────────────────────────────────────────────────────────
  function setupConfigForm() {
    ['inputCliente', 'inputPeriodo', 'inputDescricao'].forEach(id => {
      $(id)?.addEventListener('input', e => {
        const map = { inputCliente: 'cliente', inputPeriodo: 'periodo', inputDescricao: 'descricao' };
        state.config[map[id]] = e.target.value;
      });
    });

    $('btnProcessar')?.addEventListener('click', processarFaturamento);
    $('btnVoltar'   )?.addEventListener('click', () => goToStep(1));
    $('btnExportar' )?.addEventListener('click', exportarPlanilha);
    $('btnNovoArquivo')?.addEventListener('click', resetApp);
  }

  // ── Processing ───────────────────────────────────────────────────────────
  function processarFaturamento() {
    if (!state.rawRows.length) {
      showToast('Aguarde o arquivo terminar de carregar.', 'warn');
      return;
    }

    showProcessing('Processando faturamento...');

    setTimeout(() => {
      try {
        state.billingData = DB1Processor.process(state.rawRows, state.config);

        if (!state.billingData.summary) {
          hideProcessing();
          showToast('Nenhuma linha faturável encontrada na planilha.', 'warn');
          return;
        }

        hideProcessing();
        goToStep(2);
        renderStep2();
        showToast('Faturamento gerado com sucesso!', 'success');
      } catch (err) {
        hideProcessing();
        showToast('Erro ao processar: ' + err.message, 'error');
        console.error(err);
      }
    }, 600);
  }

  function exportarPlanilha() {
    if (!state.billingData) return;
    showProcessing('Gerando planilha de detalhes...');
    setTimeout(() => {
      try {
        DB1Exporter.exportDetail(state.billingData, {
          cliente:  state.config.cliente,
          periodo:  state.config.periodo,
          fileName: `Faturamento_${(state.config.cliente || 'DB1').replace(/\s+/g,'_')}_${state.config.periodo || today()}.xlsx`,
        });
        hideProcessing();
        showToast('Planilha de detalhes exportada com sucesso!', 'success');
      } catch (err) {
        hideProcessing();
        showToast('Erro ao exportar: ' + err.message, 'error');
      }
    }, 400);
  }

  // ── Step navigation ──────────────────────────────────────────────────────
  function setupStepNavigation() {
    document.querySelectorAll('.step').forEach(el => {
      el.addEventListener('click', () => {
        const n = parseInt(el.dataset.step);
        if (n < state.currentStep || (n === 2 && state.billingData)) {
          goToStep(n);
        }
      });
    });
  }

  function goToStep(n) {
    state.currentStep = n;
    renderStep(n);
  }

  function renderStep(n) {
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    $(`step${n}`)?.classList.add('active');

    document.querySelectorAll('.step').forEach(el => {
      const sn = parseInt(el.dataset.step);
      el.classList.remove('active', 'completed');
      if (sn === n)        el.classList.add('active');
      else if (sn < n)     el.classList.add('completed');
    });

    document.querySelectorAll('.step-divider').forEach((div, i) => {
      div.classList.toggle('done', i + 1 < n);
    });
  }

  // ── Step 2 render ─────────────────────────────────────────────────────────
  function renderStep2() {
    const { summary, projects, rows, meta } = state.billingData;

    // Summary cards
    $('summaryHoras' ).textContent = summary.horasFormatado;
    $('summaryValor' ).textContent = summary.valorFormatado;
    $('summaryProjetos').textContent = summary.totalProjetos;
    $('summaryLinhas'  ).textContent = meta.billableRows;

    // Header info
    $('infoCliente').textContent = summary.cliente  || '—';
    $('infoPeriodo').textContent = summary.periodo  || '—';
    $('infoTaxa'   ).textContent = DB1Processor.formatCurrency(summary.taxaHora) + '/hora';

    // Render tabs
    renderProjectsTab(projects, summary);
    renderDetailTab(rows);

    setupTabs();
  }

  function renderProjectsTab(projects, summary) {
    const tbody = $('tbodyProjetos');
    tbody.innerHTML = '';
    projects.forEach(p => {
      const pct = ((p.totalHoras / summary.totalHoras) * 100).toFixed(1);
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td><strong>${escHtml(p.projectId)}</strong></td>
          <td>${escHtml(p.empresa)}</td>
          <td>${p.rows.length}</td>
          <td>${DB1Processor.formatHours(p.totalHoras)} h</td>
          <td><span class="badge badge-blue">${pct}%</span></td>
          <td>${DB1Processor.formatCurrency(p.totalValor)}</td>
        </tr>
      `);
    });

    $('tfootProjetos').innerHTML = `
      <tr>
        <td colspan="3"><strong>TOTAL</strong></td>
        <td><strong>${DB1Processor.formatHours(summary.totalHoras)} h</strong></td>
        <td><strong>100%</strong></td>
        <td><strong>${summary.valorFormatado}</strong></td>
      </tr>
    `;
  }

  function renderDetailTab(rows, filter = '') {
    const tbody = $('tbodyDetail');
    tbody.innerHTML = '';
    const term = filter.toLowerCase();
    const filtered = filter ? rows.filter(r =>
      r.descTarefa.toLowerCase().includes(term) ||
      r.recurso.toLowerCase().includes(term)    ||
      r.projectId.toLowerCase().includes(term)  ||
      r.empresa.toLowerCase().includes(term)
    ) : rows;

    if (!filtered.length) {
      tbody.insertAdjacentHTML('beforeend', `
        <tr><td colspan="8" style="text-align:center;color:var(--db1-gray-400);padding:2rem">
          Nenhum registro encontrado.
        </td></tr>
      `);
      return;
    }

    filtered.forEach(r => {
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td><span class="badge badge-blue">${escHtml(r.projectId)}</span></td>
          <td>${escHtml(r.recurso)}</td>
          <td title="${escHtml(r.descTarefa)}">${escHtml(truncate(r.descTarefa, 55))}</td>
          <td>${escHtml(r.servico)}</td>
          <td>${DB1Processor.formatDate(r.dataInicio)}</td>
          <td>${DB1Processor.formatDate(r.dataTermino)}</td>
          <td>${DB1Processor.formatHours(r.horasRealizadas)} h</td>
          <td>${DB1Processor.formatCurrency(r.horasRealizadas * DB1Processor.RATE_PER_HOUR)}</td>
        </tr>
      `);
    });

    $('detailCount').textContent = `${filtered.length} registro${filtered.length !== 1 ? 's' : ''}`;
  }

  // ── Tabs ─────────────────────────────────────────────────────────────────
  function setupTabs() {
    document.querySelectorAll('.tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        state.activeTab = target;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        $(`panel-${target}`)?.classList.add('active');
      });
    });
  }

  // ── Detail search ─────────────────────────────────────────────────────────
  function setupDetailSearch() {
    $('searchDetail')?.addEventListener('input', e => {
      state.detailFilter = e.target.value;
      if (state.billingData) renderDetailTab(state.billingData.rows, state.detailFilter);
    });
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function resetApp() {
    state = { currentStep: 1, file: null, rawRows: [], billingData: null,
              config: { cliente: '', periodo: '', descricao: '' },
              detailFilter: '', activeTab: 'projetos' };
    $('fileInput').value    = '';
    $('fileSelected').classList.remove('show');
    $('uploadZone').style.display = '';
    $('btnProcessar').disabled = true;
    $('rowCount').textContent  = '';
    $('inputCliente').value = '';
    $('inputPeriodo').value = '';
    $('inputDescricao').value = '';
    goToStep(1);
  }

  // ── Utilities ─────────────────────────────────────────────────────────────
  function showProcessing(msg = 'Processando...') {
    $('processingMsg').textContent = msg;
    $('processingOverlay').classList.add('show');
  }

  function hideProcessing() {
    $('processingOverlay').classList.remove('show');
  }

  function showToast(msg, type = 'success') {
    const icons = { success: '✅', error: '❌', warn: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast ${type === 'error' ? 'error' : type === 'warn' ? 'warn' : ''}`;
    el.innerHTML = `<span>${icons[type] || '✅'}</span><span>${msg}</span>`;
    $('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  function formatBytes(bytes) {
    if (bytes < 1024)       return bytes + ' B';
    if (bytes < 1024*1024)  return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1024/1024).toFixed(1) + ' MB';
  }

  function truncate(str, n) {
    return str.length > n ? str.slice(0, n) + '…' : str;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function today() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}`;
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
