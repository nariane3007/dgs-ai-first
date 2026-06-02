"""
app.py — DB1 Faturamento — Flask Backend
Serves the UI and exposes two processing endpoints:
  POST /api/faturamento   → runs db1-faturamento-html skill → returns HTML
  POST /api/relatorio     → runs db1-report-transform skill → returns .xlsx
"""

import os
import uuid
import subprocess
from pathlib import Path
from flask import (
    Flask, request, send_from_directory,
    jsonify, send_file, abort
)
from werkzeug.utils import secure_filename

BASE_DIR     = Path(__file__).parent
UPLOAD_DIR   = BASE_DIR / 'tmp' / 'uploads'
OUTPUT_DIR   = BASE_DIR / 'tmp' / 'outputs'
SCRIPTS_DIR  = BASE_DIR / 'src' / 'scripts'

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED = {'.xlsx', '.xls', '.csv'}

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path='')


# ── Static files ──────────────────────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory(str(BASE_DIR), 'index.html')


# ── Health ────────────────────────────────────────────────────────────────────
@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'version': '1.0'})


# ── Etapa 1: Faturamento HTML (skill: db1-faturamento-html) ───────────────────
@app.route('/api/faturamento', methods=['POST'])
def api_faturamento():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado.'}), 400

    f = request.files['file']
    if not f.filename:
        return jsonify({'error': 'Nome de arquivo inválido.'}), 400

    suffix = Path(f.filename).suffix.lower()
    if suffix not in ALLOWED:
        return jsonify({'error': f'Formato não suportado: {suffix}'}), 400

    job_id    = uuid.uuid4().hex
    safe_name = secure_filename(f.filename)
    input_path  = UPLOAD_DIR / f'{job_id}_{safe_name}'
    output_path = OUTPUT_DIR / f'{job_id}_relatorio_faturamento.html'

    f.save(str(input_path))

    # Extract optional column overrides from form
    col_total   = request.form.get('col_total',   'TOTAL')
    col_area    = request.form.get('col_area',    'Cod. Area')
    col_projeto = request.form.get('col_projeto', 'Cód. Equipe Responsável')
    col_resp    = request.form.get('col_resp',    'Cód. Responsavel')

    script = SCRIPTS_DIR / 'gerar_relatorio.py'

    result = subprocess.run(
        [
            'python', str(script),
            '--input',       str(input_path),
            '--output',      str(output_path),
            '--col-total',   col_total,
            '--col-area',    col_area,
            '--col-projeto', col_projeto,
            '--col-resp',    col_resp,
        ],
        capture_output=True, text=True, encoding='utf-8'
    )

    if result.returncode != 0:
        return jsonify({
            'error': 'Erro ao processar o arquivo.',
            'detail': result.stderr or result.stdout,
        }), 500

    if not output_path.exists():
        return jsonify({'error': 'Arquivo de saída não gerado.'}), 500

    # Return the HTML content directly
    html_content = output_path.read_text(encoding='utf-8')
    return jsonify({
        'status': 'ok',
        'job_id': job_id,
        'html': html_content,
        'log': result.stdout,
    })


# ── Etapa 2: Planilha de Detalhes (skill: db1-report-transform) ───────────────
@app.route('/api/relatorio', methods=['POST'])
def api_relatorio():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado.'}), 400

    f = request.files['file']
    if not f.filename:
        return jsonify({'error': 'Nome de arquivo inválido.'}), 400

    suffix = Path(f.filename).suffix.lower()
    if suffix not in ALLOWED:
        return jsonify({'error': f'Formato não suportado: {suffix}'}), 400

    job_id    = uuid.uuid4().hex
    safe_name = secure_filename(f.filename)
    input_path  = UPLOAD_DIR / f'{job_id}_{safe_name}'
    output_path = OUTPUT_DIR / f'{job_id}_relatorio_db1.xlsx'

    f.save(str(input_path))

    script = SCRIPTS_DIR / 'report_transform.py'

    result = subprocess.run(
        [
            'python', str(script),
            '--input',  str(input_path),
            '--output', str(output_path),
        ],
        capture_output=True, text=True, encoding='utf-8'
    )

    if result.returncode != 0:
        return jsonify({
            'error': 'Erro ao gerar a planilha de detalhes.',
            'detail': result.stderr or result.stdout,
        }), 500

    if not output_path.exists():
        return jsonify({'error': 'Planilha de saída não gerada.'}), 500

    return send_file(
        str(output_path),
        as_attachment=True,
        download_name=f'Relatorio_DB1_{job_id[:8]}.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )


# ── Cleanup helper (optional) ─────────────────────────────────────────────────
@app.route('/api/cleanup', methods=['POST'])
def cleanup():
    removed = 0
    for p in list(UPLOAD_DIR.iterdir()) + list(OUTPUT_DIR.iterdir()):
        try:
            p.unlink()
            removed += 1
        except Exception:
            pass
    return jsonify({'removed': removed})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\n{'='*55}")
    print(f"  DB1 Faturamento App rodando em http://localhost:{port}")
    print(f"{'='*55}\n")
    app.run(debug=False, port=port)
