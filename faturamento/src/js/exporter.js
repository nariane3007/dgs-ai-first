/**
 * exporter.js — Generates the detail Excel spreadsheet for client delivery.
 * Uses SheetJS (xlsx) to create a formatted .xlsx file.
 */

const DB1Exporter = {

  /**
   * Builds and triggers download of the detail spreadsheet.
   * @param {Object} data  — result from DB1Processor.process()
   * @param {Object} config — { cliente, periodo, fileName }
   */
  exportDetail(data, config = {}) {
    if (!window.XLSX) {
      alert('Biblioteca XLSX não carregada. Verifique a conexão.');
      return;
    }

    const XLSX = window.XLSX;
    const wb   = XLSX.utils.book_new();

    // ── Sheet 1: Resumo ─────────────────────────────────────────────────────
    this._addSummarySheet(wb, XLSX, data, config);

    // ── Sheet 2: Detalhamento por Projeto ───────────────────────────────────
    this._addProjectSheet(wb, XLSX, data);

    // ── Sheet 3: Linhas Detalhadas ───────────────────────────────────────────
    this._addDetailSheet(wb, XLSX, data);

    // Download
    const fileName = config.fileName ||
      `Faturamento_${(config.cliente || 'DB1').replace(/\s+/g, '_')}_${this._dateSuffix()}.xlsx`;

    XLSX.writeFile(wb, fileName);
  },

  _dateSuffix() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  },

  _addSummarySheet(wb, XLSX, data, config) {
    const { summary, projects } = data;
    const rows = [];

    rows.push(['RELATÓRIO DE FATURAMENTO DB1']);
    rows.push([]);
    rows.push(['Cliente:',   summary.cliente  || config.cliente  || '']);
    rows.push(['Período:',   summary.periodo  || config.periodo  || '']);
    rows.push(['Emissão:',   new Date().toLocaleDateString('pt-BR')]);
    rows.push(['Taxa/hora:', `R$ ${summary.taxaHora.toFixed(2).replace('.',',')}`]);
    rows.push([]);
    rows.push(['RESUMO GERAL']);
    rows.push(['Total de Horas', 'Total Projetos', 'Valor Total']);
    rows.push([
      parseFloat(summary.totalHoras.toFixed(2)),
      summary.totalProjetos,
      parseFloat(summary.totalValor.toFixed(2)),
    ]);
    rows.push([]);
    rows.push(['RESUMO POR PROJETO']);
    rows.push(['Projeto', 'Empresa', 'Horas', 'Valor (R$)']);
    projects.forEach(p => {
      rows.push([
        p.projectId,
        p.empresa,
        parseFloat(p.totalHoras.toFixed(2)),
        parseFloat(p.totalValor.toFixed(2)),
      ]);
    });
    rows.push([
      'TOTAL', '',
      parseFloat(summary.totalHoras.toFixed(2)),
      parseFloat(summary.totalValor.toFixed(2)),
    ]);

    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Column widths
    ws['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 18 }];

    // Merge title cell
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    XLSX.utils.book_append_sheet(wb, ws, 'Resumo');
  },

  _addProjectSheet(wb, XLSX, data) {
    const aoa = [['Projeto', 'Empresa', 'Qtd Tarefas', 'Total Horas', 'Valor (R$)']];
    data.projects.forEach(p => {
      aoa.push([
        p.projectId,
        p.empresa,
        p.rows.length,
        parseFloat(p.totalHoras.toFixed(2)),
        parseFloat(p.totalValor.toFixed(2)),
      ]);
    });
    aoa.push([
      'TOTAL', '', '',
      parseFloat(data.summary.totalHoras.toFixed(2)),
      parseFloat(data.summary.totalValor.toFixed(2)),
    ]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 14 }, { wch: 14 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Por Projeto');
  },

  _addDetailSheet(wb, XLSX, data) {
    const headers = [
      'Projeto', 'Tarefa', 'Descrição', 'Recurso', 'Empresa',
      'Solicitante', 'Serviço', 'Prioridade',
      'Data Início', 'Data Término', 'Horas', 'Valor (R$)',
      'Complemento',
    ];
    const aoa = [headers];

    data.rows.forEach(r => {
      aoa.push([
        r.projectId,
        r.taskId || r.codTarefa,
        r.descTarefa,
        r.recurso,
        r.empresa,
        r.solicitante,
        r.servico,
        r.prioridade,
        DB1Processor.formatDate(r.dataInicio),
        DB1Processor.formatDate(r.dataTermino),
        parseFloat(r.horasRealizadas.toFixed(2)),
        parseFloat((r.horasRealizadas * DB1Processor.RATE_PER_HOUR).toFixed(2)),
        r.infCompl,
      ]);
    });

    // Totals row
    aoa.push([
      'TOTAL', '', '', '', '', '', '', '', '', '',
      parseFloat(data.summary.totalHoras.toFixed(2)),
      parseFloat(data.summary.totalValor.toFixed(2)),
      '',
    ]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [
      {wch:18},{wch:14},{wch:40},{wch:22},{wch:20},
      {wch:20},{wch:20},{wch:12},{wch:14},{wch:14},
      {wch:10},{wch:14},{wch:40},
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Detalhamento');
  },
};

window.DB1Exporter = DB1Exporter;
