#!/usr/bin/env python3
"""DB1 Faturamento HTML Report Generator"""

import argparse, sys, json
from pathlib import Path
from datetime import datetime
import pandas as pd

HORA_VALUE = 229.92
PROJECT_MAP = {666: "PORTAL", 667: "VENTAS"}
MESES = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho",
         "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]

PLANEJADO = {
    667: [219667.81,188286.70,230128.19,208256.50,198747.07,
          219667.81,153101.81,139788.61,139788.61,139788.61,126475.41,125524.46],
    666: [159758.41,136935.78,167365.95,151459.27,144543.32,
          159758.40,109358.44, 99849.01, 99849.01, 99849.01, 90339.58, 83682.98],
}
FATURADO = {
    667: [170428.20,225965.38,248587.20,248720.56,None,None,None,None,None,None,None,None],
    666: [163485.50,163388.05,157136.52, 39428.98,None,None,None,None,None,None,None,None],
}

C = {
    "db1_orange":"#E8501A","db1_navy":"#1A1A2E",
    "plaenge_blue_dark":"#003B73","plaenge_blue_mid":"#0074C2","plaenge_blue_light":"#E8F4FD",
    "white":"#FFFFFF","gray_light":"#F5F5F5","gray_mid":"#DEE2E6",
    "text_dark":"#212529","text_muted":"#6C757D","success":"#28A745","danger":"#DC3545",
}

def fmt_brl(v):
    s = f"{v:,.2f}".replace(",","X").replace(".",",").replace("X",".")
    return "R$ " + s

def fmt_hours(v):
    return f"{v:,.2f}h".replace(",","X").replace(".",",").replace("X",".")

def _norm(s):
    """Lowercase + strip accents for fuzzy column matching."""
    import unicodedata
    return unicodedata.normalize('NFKD', str(s)).encode('ascii','ignore').decode().strip().lower()

def find_col(df, candidates):
    norm = {_norm(c): c for c in df.columns}
    for cand in candidates:
        k = _norm(cand)
        if k in norm:
            return norm[k]
        # partial match fallback
        for col_key, col_orig in norm.items():
            if k in col_key or col_key in k:
                return col_orig
    return None

def find_header_row(filepath, sheet_name=0, max_rows=30):
    """Detect the row index that contains the real column headers."""
    probe = pd.read_excel(filepath, sheet_name=sheet_name, header=None, nrows=max_rows)
    keywords = ['total', 'desc tarefa', 'dh inicio', 'dh início', 'cod. area',
                'cód. responsavel', 'cod. responsavel', 'cód. equipe', 'cod. equipe']
    for i, row in probe.iterrows():
        vals = [str(v).strip().lower() for v in row.values if pd.notna(v)]
        if any(any(k in v for k in keywords) for v in vals):
            print(f"[INFO] Cabeçalho detectado na linha {i}")
            return i
    return 0

def load_data(filepath, col_total, col_area, col_projeto):
    sheets = pd.read_excel(filepath, sheet_name=None, header=None, nrows=1)
    sheet_names = list(sheets.keys())

    for name in sheet_names:
        header_row = find_header_row(filepath, sheet_name=name)
        sdf = pd.read_excel(filepath, sheet_name=name, header=header_row)
        sdf.columns = [str(c).strip() for c in sdf.columns]
        cols_lower = [c.lower() for c in sdf.columns]
        if any('total' in c or 'desc tarefa' in c or 'dh in' in c for c in cols_lower):
            print(f"[INFO] Sheet: '{name}' | header row: {header_row}")
            return sdf

    # fallback: first sheet with auto-detected header
    name = sheet_names[0]
    header_row = find_header_row(filepath, sheet_name=name)
    df = pd.read_excel(filepath, sheet_name=name, header=header_row)
    df.columns = [str(c).strip() for c in df.columns]
    return df

def process_data(df, col_total, col_area, col_projeto, col_resp="Cod. Responsavel"):
    t = find_col(df,[col_total,"TOTAL","Total","total"]) or col_total
    a = find_col(df,[col_area,"Cod. Area","Cod.Area","COD. AREA"]) or col_area
    p = find_col(df,[col_projeto,"Cód. Equipe Responsável","Cod. Equipe Responsavel","Projeto"]) or col_projeto
    r = find_col(df,[col_resp,"Cód. Responsavel","Cod. Responsavel","COD. RESPONSAVEL","Responsavel"])

    print(f"[INFO] TOTAL='{t}' | Area='{a}' | Projeto='{p}' | Responsavel='{r}'")
    for c in [t,a,p]:
        if c not in df.columns:
            print(f"[ERROR] Column '{c}' not found. Available: {df.columns.tolist()}")
            sys.exit(1)

    total_rows = len(df)
    df2 = df[df[a].astype(str).str.strip().str.upper() != "NAO_FATURADO"].copy()
    excl = total_rows - len(df2)
    df2[t] = pd.to_numeric(df2[t], errors="coerce").fillna(0)

    def to_int(v):
        try: return int(float(str(v).strip()))
        except: return v

    df2["_pc"] = df2[p].apply(to_int)

    grp = df2.groupby("_pc")[t].sum().reset_index()
    grp.columns = ["code","hours"]
    grp["label"] = grp["code"].apply(lambda c: PROJECT_MAP.get(c, f"OUTROS ({c})"))
    grp["value"] = grp["hours"] * HORA_VALUE
    grp = grp.sort_values("code")

    colabs = {}
    if r and r in df2.columns:
        g2 = df2.groupby(["_pc",r])[t].sum().reset_index()
        g2.columns = ["code","responsavel","hours"]
        g2["value"] = g2["hours"] * HORA_VALUE
        g2 = g2.sort_values(["code","hours"],ascending=[True,False])
        for code in g2["code"].unique():
            sub = g2[g2["code"]==code]
            colabs[int(code)] = sub[["responsavel","hours","value"]].to_dict("records")

    return {
        "rows": grp.to_dict("records"),
        "total_hours": grp["hours"].sum(),
        "total_value": grp["value"].sum(),
        "total_rows": total_rows,
        "excluded_rows": excl,
        "billable_rows": len(df2),
        "colabs_by_proj": colabs,
    }


# ── HTML builders ─────────────────────────────────────────────────────────────

def build_colabs_section(colabs_by_proj):
    if not colabs_by_proj:
        return ""
    navy=C["db1_navy"]; org=C["db1_orange"]; pbd=C["plaenge_blue_dark"]
    pbm=C["plaenge_blue_mid"]; white=C["white"]; gray=C["gray_light"]
    gm=C["gray_mid"]; muted=C["text_muted"]; succ=C["success"]; dark=C["text_dark"]
    th_s = (f'style="background:{pbd};color:{white};padding:10px 16px;'
            f'font-size:12px;text-transform:uppercase;letter-spacing:1px;text-align:left;"')
    blocks = []
    for code in sorted(colabs_by_proj.keys()):
        label = PROJECT_MAP.get(code, f"OUTROS ({code})")
        ip    = "PORTAL" in label
        hdr   = pbd if ip else pbm
        bdg   = org if ip else pbm
        cols  = colabs_by_proj[code]
        tot_h = sum(c["hours"] for c in cols)
        tot_v = sum(c["value"] for c in cols)
        rows  = []
        for i, c in enumerate(cols):
            pct = (c["hours"]/tot_h*100) if tot_h else 0
            bg  = gray if i%2==0 else white
            rows.append(
                f'<tr style="background:{bg};">'
                f'<td style="padding:10px 16px;font-weight:600;color:{dark};">{c["responsavel"]}</td>'
                f'<td style="padding:10px 16px;color:{pbd};font-weight:600;">{fmt_hours(c["hours"])}</td>'
                f'<td style="padding:10px 16px;font-weight:700;color:{succ};">{fmt_brl(c["value"])}</td>'
                f'<td style="padding:10px 16px;">'
                f'<div style="display:flex;align-items:center;gap:8px;">'
                f'<div style="flex:1;height:6px;background:{gm};border-radius:3px;overflow:hidden;">'
                f'<div style="width:{pct:.1f}%;height:100%;background:{bdg};border-radius:3px;"></div></div>'
                f'<span style="font-size:12px;color:{muted};min-width:36px;">{pct:.1f}%</span>'
                f'</div></td></tr>'
            )
        rows.append(
            f'<tr style="background:{navy};color:{white};font-weight:800;">'
            f'<td style="padding:10px 16px;">TOTAL {label}</td>'
            f'<td style="padding:10px 16px;">{fmt_hours(tot_h)}</td>'
            f'<td style="padding:10px 16px;">{fmt_brl(tot_v)}</td>'
            f'<td style="padding:10px 16px;">100,0%</td></tr>'
        )
        blocks.append(
            f'<div style="background:{white};border-radius:10px;overflow:hidden;'
            f'box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:28px;">'
            f'<div style="background:{hdr};padding:14px 20px;display:flex;align-items:center;gap:12px;color:{white};">'
            f'<span style="background:{bdg};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:800;">{code}</span>'
            f'<span style="font-size:15px;font-weight:700;">{label} - Valores por Colaborador</span></div>'
            f'<table style="width:100%;border-collapse:collapse;">'
            f'<thead><tr>'
            f'<th {th_s}>Colaborador</th>'
            f'<th {th_s}>Horas</th>'
            f'<th {th_s}>Valor</th>'
            f'<th {th_s}>Participacao</th>'
            f'</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
        )
    return "\n".join(blocks)


def build_monthly_block(proj_code, proj_label, is_portal):
    planejado = PLANEJADO[proj_code]
    faturado  = FATURADO[proj_code]
    hdr  = C["plaenge_blue_dark"] if is_portal else C["plaenge_blue_mid"]
    bdg  = C["db1_orange"] if is_portal else C["plaenge_blue_mid"]
    org  = C["db1_orange"]
    navy = C["db1_navy"]; white = C["white"]; pbd = C["plaenge_blue_dark"]
    succ = C["success"]; dngr = C["danger"]; muted = C["text_muted"]
    gm   = C["gray_mid"]

    meses_fat   = sum(1 for v in faturado if v is not None)
    total_plan  = sum(planejado)
    total_fat   = sum(v for v in faturado if v is not None)
    plan_so_far = sum(planejado[:meses_fat])
    diferenca   = total_fat - plan_so_far
    dif_color   = succ if diferenca >= 0 else dngr
    dif_signal  = "+" if diferenca >= 0 else ""

    labels_js = json.dumps(MESES)
    plan_js   = json.dumps(planejado)
    fat_js    = "[" + ",".join(("null" if v is None else str(v)) for v in faturado) + "]"
    cid       = f"chart{proj_code}"
    th_s = (f'style="background:{pbd};color:{white};padding:10px 16px;'
            f'font-size:12px;text-transform:uppercase;letter-spacing:1px;text-align:left;"')

    rows = []
    for i, mes in enumerate(MESES):
        pv = planejado[i]
        fv = faturado[i]
        if fv is not None:
            diff  = fv - pv
            ds    = ("+" if diff>=0 else "") + fmt_brl(diff)
            dc    = succ if diff>=0 else dngr
            f_td  = f'<td style="font-weight:700;color:{succ};padding:10px 16px;">{fmt_brl(fv)}</td>'
            d_td  = f'<td style="font-weight:700;color:{dc};padding:10px 16px;">{ds}</td>'
        else:
            f_td = f'<td style="color:{muted};padding:10px 16px;">-</td>'
            d_td = f'<td style="color:{muted};padding:10px 16px;">-</td>'
        rows.append(
            f'<tr><td style="padding:10px 16px;"><strong>{mes}</strong></td>'
            f'<td style="padding:10px 16px;">{fmt_brl(pv)}</td>'
            f'{f_td}{d_td}</tr>'
        )
    total_row = (
        f'<tr style="background:{navy};color:{white};font-weight:800;">'
        f'<td style="padding:10px 16px;">TOTAL</td>'
        f'<td style="padding:10px 16px;">{fmt_brl(total_plan)}</td>'
        f'<td style="padding:10px 16px;">{fmt_brl(total_fat)}</td>'
        f'<td style="padding:10px 16px;color:{dif_color};">{dif_signal}{fmt_brl(diferenca)}</td>'
        f'</tr>'
    )

    parts = []
    parts.append(f'<div style="background:{C["white"]};border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:32px;">')
    parts.append(f'<div style="background:{hdr};padding:16px 20px;display:flex;align-items:center;gap:12px;color:{white};">')
    parts.append(f'<span style="background:{bdg};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:800;">{proj_code}</span>')
    parts.append(f'<span style="font-size:16px;font-weight:700;">{proj_label} - Planejado x Faturado 2025</span>')
    parts.append(f'</div><div style="padding:20px;">')
    # chart
    parts.append(f'<div style="position:relative;height:260px;margin-bottom:24px;"><canvas id="{cid}"></canvas></div>')
    parts.append('<script>(function(){')
    parts.append(f'var ctx=document.getElementById("{cid}").getContext("2d");')
    parts.append(f'new Chart(ctx,{{type:"bar",data:{{labels:{labels_js},datasets:[')
    parts.append(f'{{label:"Planejado",data:{plan_js},backgroundColor:"rgba(0,59,115,0.2)",borderColor:"{hdr}",borderWidth:2,borderRadius:4}},')
    parts.append(f'{{label:"Faturado",data:{fat_js},backgroundColor:"{org}BB",borderColor:"{org}",borderWidth:2,borderRadius:4}}]}},')
    parts.append('options:{responsive:true,maintainAspectRatio:false,')
    parts.append('plugins:{legend:{position:"top"},tooltip:{callbacks:{label:function(c){')
    parts.append('var v=c.parsed.y;if(v==null)return c.dataset.label+": -";')
    parts.append('return c.dataset.label+": R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:2});}}}},')
    parts.append('scales:{y:{ticks:{callback:function(v){return "R$ "+(v/1000).toFixed(0)+"K";}},')
    parts.append('grid:{color:"rgba(0,0,0,0.05)"}},x:{grid:{display:false}}}}});')
    parts.append('})();</script>')
    # table
    parts.append(f'<table style="width:100%;border-collapse:collapse;">')
    parts.append(f'<thead><tr>')
    for h in ["Mes","Planejado","Faturado","Diferenca"]:
        parts.append(f'<th {th_s}>{h}</th>')
    parts.append(f'</tr></thead><tbody>{"".join(rows)}{total_row}</tbody></table>')
    parts.append('</div></div>')
    return "\n".join(parts)


def generate_html(data, output_path):
    now  = datetime.now().strftime("%d/%m/%Y %H:%M")
    navy=C["db1_navy"]; org=C["db1_orange"]; pbm=C["plaenge_blue_mid"]
    pbd=C["plaenge_blue_dark"]; pbl=C["plaenge_blue_light"]; white=C["white"]
    gray=C["gray_light"]; gm=C["gray_mid"]; muted=C["text_muted"]
    dark=C["text_dark"]; succ=C["success"]

    total_plan_all = sum(PLANEJADO[667]) + sum(PLANEJADO[666])
    total_fat_all  = (sum(v for v in FATURADO[667] if v is not None) +
                      sum(v for v in FATURADO[666] if v is not None))

    # cards
    cards = []
    for row in data["rows"]:
        pct  = (row["hours"]/data["total_hours"]*100) if data["total_hours"] else 0
        ip   = "PORTAL" in row["label"]
        ca   = pbd if ip else pbm
        bc   = org if ip else pbm
        cards.append(
            f'<div style="background:{white};border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">'
            f'<div style="background:{ca};padding:16px 20px;display:flex;align-items:center;gap:12px;color:{white};">'
            f'<span style="background:{bc};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:800;">{row["code"]}</span>'
            f'<span style="font-size:16px;font-weight:700;">{row["label"]}</span></div>'
            f'<div style="padding:20px;">'
            f'<div style="display:flex;gap:12px;margin-bottom:12px;">'
            f'<div style="flex:1;background:{gray};border-radius:8px;padding:12px;text-align:center;">'
            f'<div style="font-size:10px;text-transform:uppercase;color:{muted};margin-bottom:4px;">Horas</div>'
            f'<div style="font-weight:800;font-size:18px;color:{pbd};">{fmt_hours(row["hours"])}</div></div>'
            f'<div style="flex:1;background:{gray};border-radius:8px;padding:12px;text-align:center;">'
            f'<div style="font-size:10px;text-transform:uppercase;color:{muted};margin-bottom:4px;">Valor</div>'
            f'<div style="font-weight:800;font-size:15px;color:{succ};">{fmt_brl(row["value"])}</div></div>'
            f'</div>'
            f'<div style="height:8px;background:{gm};border-radius:4px;overflow:hidden;">'
            f'<div style="width:{pct:.1f}%;height:100%;background:{bc};border-radius:4px;"></div></div>'
            f'</div></div>'
        )
    cards_html = "\n".join(cards)

    # detail table rows
    th_s = f'style="background:{pbd};color:{white};padding:12px 20px;font-size:12px;text-transform:uppercase;letter-spacing:1px;text-align:left;"'
    det  = []
    for row in data["rows"]:
        det.append(
            f'<tr><td style="padding:12px 20px;font-weight:600;color:{pbd};">{row["code"]}</td>'
            f'<td style="padding:12px 20px;"><strong>{row["label"]}</strong></td>'
            f'<td style="padding:12px 20px;font-weight:600;color:{pbd};">{fmt_hours(row["hours"])}</td>'
            f'<td style="padding:12px 20px;font-weight:700;color:{succ};">{fmt_brl(row["value"])}</td></tr>'
        )
    det.append(
        f'<tr style="background:{navy};color:{white};font-weight:800;">'
        f'<td style="padding:12px 20px;" colspan="2">TOTAL GERAL</td>'
        f'<td style="padding:12px 20px;">{fmt_hours(data["total_hours"])}</td>'
        f'<td style="padding:12px 20px;">{fmt_brl(data["total_value"])}</td></tr>'
    )
    det_html = "\n".join(det)

    # summary bar
    def si(label, value, sub):
        return (f'<div style="flex:1;min-width:160px;padding:20px 32px;border-right:1px solid rgba(255,255,255,0.25);">'
                f'<div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.85;">{label}</div>'
                f'<div style="font-size:20px;font-weight:800;margin-top:4px;">{value}</div>'
                f'<div style="font-size:11px;opacity:0.75;margin-top:2px;">{sub}</div></div>')

    summ = (si("Horas Faturáveis", fmt_hours(data["total_hours"]), "da planilha atual") +
            si("Valor a Faturar", fmt_brl(data["total_value"]), "a R$ 229,92/hora") +
            si("Faturado Acumulado 2025", fmt_brl(total_fat_all), "Portal + Ventas") +
            si("Planejado Anual 2025", fmt_brl(total_plan_all), "Portal + Ventas"))

    def sec(text):
        return (f'<div style="font-size:13px;font-weight:700;text-transform:uppercase;'
                f'letter-spacing:1.5px;color:{muted};margin-bottom:20px;">{text}</div>')

    colabs_html  = build_colabs_section(data.get("colabs_by_proj", {}))
    mb_ventas    = build_monthly_block(667, "VENTAS", False)
    mb_portal    = build_monthly_block(666, "PORTAL", True)

    parts = []
    parts.append('<!DOCTYPE html>')
    parts.append('<html lang="pt-BR"><head>')
    parts.append('<meta charset="UTF-8"/>')
    parts.append('<meta name="viewport" content="width=device-width,initial-scale=1.0"/>')
    parts.append('<title>Relatorio de Faturamento - DB1 x Plaenge</title>')
    parts.append('<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>')
    parts.append(
        f'<style>*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0;}}'
        f'body{{font-family:"Segoe UI",Arial,sans-serif;background:{gray};color:{dark};min-height:100vh;}}'
        f'table{{width:100%;border-collapse:collapse;background:{white};border-radius:10px;overflow:hidden;'
        f'box-shadow:0 2px 8px rgba(0,0,0,0.06);margin-bottom:40px;}}'
        f'td{{border-bottom:1px solid {gm};}}'
        f'tr:last-child td{{border-bottom:none;}}'
        f'tr:hover td{{background:{pbl};}}'
        f'</style></head><body>'
    )
    # header
    parts.append(
        f'<header style="background:{navy};color:{white};display:flex;align-items:center;'
        f'justify-content:space-between;padding:0 40px;height:70px;">'
        f'<div style="display:flex;align-items:center;gap:16px;">'
        f'<span style="font-size:22px;font-weight:900;letter-spacing:2px;color:{org};">DB1</span>'
        f'<span style="color:{muted};font-size:20px;">x</span>'
        f'<span style="font-size:18px;font-weight:700;color:{pbm};letter-spacing:1px;">PLAENGE</span>'
        f'</div>'
        f'<div style="font-size:12px;color:{muted};text-align:right;">Gerado em {now}<br/>Valor Hora: R$ 229,92</div>'
        f'</header>'
    )
    parts.append(f'<div style="height:5px;background:linear-gradient(90deg,{org},{pbm});"></div>')
    # title
    parts.append(
        f'<div style="background:{white};padding:32px 40px 24px;border-bottom:1px solid {gm};">'
        f'<h1 style="font-size:26px;font-weight:700;color:{navy};">Relatorio de Faturamento</h1>'
        f'<p style="margin-top:6px;font-size:14px;color:{muted};">{data["billable_rows"]} registros faturáveis processados</p>'
        f'</div>'
    )
    # summary bar
    parts.append(f'<div style="background:{org};color:{white};display:flex;flex-wrap:wrap;">{summ}</div>')
    # main
    parts.append('<main style="padding:36px 40px;">')
    parts.append(sec("Resumo por Projeto (Planilha Atual)"))
    parts.append(f'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;margin-bottom:40px;">{cards_html}</div>')
    parts.append(sec("Detalhamento de Horas"))
    parts.append(f'<table><thead><tr><th {th_s}>Codigo</th><th {th_s}>Projeto</th><th {th_s}>Horas</th><th {th_s}>Valor (R$ 229,92/h)</th></tr></thead><tbody>{det_html}</tbody></table>')
    
    
    parts.append(sec("Planejado x Faturado por Mes"))
    parts.append(mb_ventas)
    parts.append(mb_portal)
    parts.append('</main>')
    parts.append(
        f'<footer style="background:{navy};color:{muted};text-align:center;padding:20px;font-size:12px;">'
        f'<strong style="color:{org};">DB1 Global Software</strong> &nbsp;·&nbsp; Relatorio gerado automaticamente em {now}'
        f'</footer></body></html>'
    )

    Path(output_path).write_text("\n".join(parts), encoding="utf-8")
    print(f"[OK] Relatorio gerado: {output_path}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input",       required=True)
    p.add_argument("--output",      default="relatorio_faturamento.html")
    p.add_argument("--col-total",   default="TOTAL")
    p.add_argument("--col-area",    default="Cod. Area")
    p.add_argument("--col-projeto", default="Cód. Equipe Responsável")
    p.add_argument("--col-resp",    default="Cód. Responsavel")
    args = p.parse_args()

    print(f"[INFO] Lendo: {args.input}")
    df   = load_data(args.input, args.col_total, args.col_area, args.col_projeto)
    data = process_data(df, args.col_total, args.col_area, args.col_projeto, args.col_resp)
    generate_html(data, args.output)

    print(f"\n{'='*50}")
    print(f"  Total de horas : {fmt_hours(data['total_hours'])}")
    print(f"  Valor a faturar: {fmt_brl(data['total_value'])}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
