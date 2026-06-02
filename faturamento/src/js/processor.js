/**
 * processor.js — DB1 Billing Processor
 * Reads the DB1 Excel spreadsheet and produces billing data structures.
 */

const DB1 = {
  RATE_PER_HOUR: 229.92,
  NON_BILLABLE_KEY: 'NAO_FATURADO',

  /**
   * Maps raw row → normalized entry
   */
  normalizeRow(row) {
    return {
      empresa:       String(row['Empresa']            || row['empresa']            || '').trim(),
      solicitante:   String(row['Solicitante']         || row['solicitante']         || '').trim(),
      servico:       String(row['Serviço']             || row['Servico']             || row['servico']     || '').trim(),
      prioridade:    String(row['Prioridade']          || row['prioridade']          || '').trim(),
      recurso:       String(row['Bookable Resource']   || row['bookable_resource']   || row['Recurso']     || '').trim(),
      projectId:     String(row['Project ID']          || row['project_id']          || row['Projeto']     || '').trim(),
      taskId:        String(row['Task ID']             || row['task_id']             || row['Tarefa']      || '').trim(),
      descTarefa:    String(row['Desc Tarefa']         || row['desc_tarefa']         || row['Descrição']   || '').trim(),
      infCompl:      String(row['Inf Compl Execucao']  || row['inf_compl']           || row['Comentário']  || '').trim(),
      horasRealizadas: parseFloat(
        row['Horas Realizadas'] || row['horas_realizadas'] ||
        row['Qtd Horas']        || row['qtd_horas']        ||
        row['Horas']            || 0
      ) || 0,
      dataInicio:    row['Dh início']   || row['dh_inicio']   || row['Data Início'] || '',
      dataTermino:   row['Dh Termino']  || row['dh_termino']  || row['Data Fim']    || '',
      codEquipe:     String(row['Cód. Equipe Responsável'] || row['cod_equipe'] || '').trim(),
      codResponsavel:String(row['Cód. Responsavel']        || row['cod_responsavel'] || '').trim(),
      codTarefa:     String(row['Cód. Tarefa']              || row['cod_tarefa']      || '').trim(),
      faturavel:     String(row['Faturável'] || row['faturavel'] || row['Status Faturamento'] || 'SIM').trim().toUpperCase(),
    };
  },

  /**
   * Excel serial date → JS Date
   */
  excelDateToJS(serial) {
    if (!serial || typeof serial !== 'number') return null;
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000);
  },

  formatDate(val) {
    if (!val) return '—';
    if (val instanceof Date) return val.toLocaleDateString('pt-BR');
    if (typeof val === 'number') {
      const d = this.excelDateToJS(val);
      return d ? d.toLocaleDateString('pt-BR') : '—';
    }
    return String(val);
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', minimumFractionDigits: 2
    }).format(value);
  },

  formatHours(h) {
    return h.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  /**
   * Main processing function.
   * Returns { summary, projects, rows, meta }
   */
  process(rawRows, config = {}) {
    const normalized = rawRows.map(r => this.normalizeRow(r));

    // Filter non-billable
    const billable = normalized.filter(r => {
      if (r.faturavel === this.NON_BILLABLE_KEY) return false;
      if (r.horasRealizadas <= 0) return false;
      return true;
    });

    if (billable.length === 0) {
      return { summary: null, projects: [], rows: [], meta: { totalRows: rawRows.length, billableRows: 0 } };
    }

    // Group by project
    const projectMap = {};
    billable.forEach(r => {
      const key = r.projectId || 'SEM_PROJETO';
      if (!projectMap[key]) {
        projectMap[key] = { projectId: key, empresa: r.empresa, rows: [], totalHoras: 0 };
      }
      projectMap[key].rows.push(r);
      projectMap[key].totalHoras += r.horasRealizadas;
    });

    const projects = Object.values(projectMap).map(p => ({
      ...p,
      totalValor: p.totalHoras * this.RATE_PER_HOUR,
    })).sort((a, b) => b.totalHoras - a.totalHoras);

    const totalHoras = projects.reduce((s, p) => s + p.totalHoras, 0);
    const totalValor = totalHoras * this.RATE_PER_HOUR;

    const summary = {
      totalHoras,
      totalValor,
      totalProjetos: projects.length,
      totalLinhas: billable.length,
      valorFormatado: this.formatCurrency(totalValor),
      horasFormatado: this.formatHours(totalHoras),
      periodo: config.periodo || '',
      cliente: config.cliente || (projects[0]?.empresa || ''),
      taxaHora: this.RATE_PER_HOUR,
    };

    return {
      summary,
      projects,
      rows: billable,
      meta: {
        totalRows: rawRows.length,
        billableRows: billable.length,
        filteredRows: rawRows.length - billable.length,
      }
    };
  },
};

window.DB1Processor = DB1;
