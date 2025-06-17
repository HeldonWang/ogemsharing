import React, { useState, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Slide from '../components/Slide';
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import remarkGfm from 'remark-gfm';

const sasCode = `data adtte;
    set adam.adtte;
    where paramcd='TRPROGM' and parqual='INDEPENDENT ASSESSOR' and mittfl='Y';
run;

%m_u_popn(
    inds=adam.adsl,
    pop_flag=mittfl="Y",
    trtgrpn=trt01pn,
    trtlev=1|2,
    UniqueIDVars=usubjid,
    trtfmtC=_tlf_setup_trtfmteff,
    gmacro=mittpopb,
    BigN=Y,
    nformat=,
    debug=Y
);

/* Number counting part */
%m_u_effcount(
    inds=adtte,
    pop_flag=mittfl='Y',
    trtgrpn=trt01pn,
    denomds=,
    pop_mvar=mittpopb,
    index={cond=CNSR=0 # label=%nrbquote(Total events [a], n (%)) #level=0 subord=1}
          {cond=cnsr=0 and find(evntdesc,'RECIST progression') label=RECIST progression level=1 subord=2}
          {cond=cnsr=0 and find(evntdesc,'RECIST progression with target') label=Target lesion [b] level=2 subord=3}
          {cond=cnsr=1 label=%nrbquote(Censored patients, n (%)) level=0 subord=4}
          {cond=cnsr=1 and find(evntdesc,'Censored RECIST progression') label=Censored RECIST progression [c] level=1 subord=5},
    statlabel=Y,
    ord=1,
    debug=N
);

/* PFS median and rate at x time with CI */
%m_u_km(
    inds=adtte,
    WHR=,
    alpha=0.05,
    method=KM,
    conftype=LOG,
    trtgrpn=trt01pN,
    trtgrpnord=2 | 1,
    trtgrpn2=,
    var_time=AVAL,
    var_status=CNSR,
    cen_num=0,
    evnt_num=,
    step_list=160 to 1686 by 160,
    step_unit=days,
    XDIVISOR=,
    plot=0,
    outdat_median=final2,
    median_label=Progression-free survival (<<unit>>) [e] [f],
    outdat_timelist=final3,
    timelist_label=Progression-free survival rate [e]
);

/* Comparison between group (HR, CI and p-value) */
%m_u_cox_logrank(
    inds=adtte,
    out=final_cox,
    blocklbl=Comparison of treatment groups [g],
    modelkey=cox|logrank,
    transfl=Y,
    trtgrpn=trt01pn,
    var=aval,
    byvar=,
    alpha=0.05,
    censor=,
    indicator=,
    ties=,
    pair=1-2,
    strata=STRAT1 STRAT2,
    pvalside=,
    missval=,
    digit=,
    cidecimal=,
    hrlbl=,
    pvallbl=,
    cilbl=,
    prefix=,
    debug=Y
);
%m_u_effcount(
    inds=adtte,
    pop_flag=mittfl='Y',
    trtgrpn=trt01pn,
    denomds=,
    pop_mvar=mittpopb,
    index={cond=MIS2TAFL='Y' # label=%nrbquote(Missed two or more consecutive Tumor Assesement) #level=0 subord=1}，
    statlabel=Y,
    ord=5,
    debug=N
);
`;

// 使用与 AZTONCEF04display 相同的 markdownTable
const markdownTable = `|                                              |              | AZD1          | AZD2        |              |
| -------------------------------------------- | ------------ | ------------- | ----------- | ------------ |
|                                              |Statistic     | <<low dose>>  | <<high dose>> | Control     |
|                                              |              |N=xxx          | N=xxx       | N=xxx        |
|Event [a]                                     |              |               |             |              |
| Any                                          | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| <<RECIST>> progression                       | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
|    Target lesions [b]                        | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
|    Non target lesions [b]                    | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
|    New lesions [b]                           | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Death without progression                    | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
|                                              |              |               |             |              |
| Censored observations                        |              |               |             |              |
| Any                                          | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Censored at Day 1                            | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Censored <<RECIST>> progression or death [c] | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Progression-free [d]                         | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Prematurely censored                         | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Progression-free at time of the analysis     | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Early study discontinuation                  | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Lost to follow-up                            | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| Withdrew consent                             | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| <<category>>                                 | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
|                                              |              |               |             |              |
| Progression-free survival                    | P25          |      x.x      |      x.x    |      x.x     |
| (<<unit>>) [e] [f]                           | Median       |     xx.x      |     xx.x    |     xx.x     |
|                                              | <<x>>% CI    |   x.x, x.x    |    x.x, x.x |    x.x, x.x  |
|                                              | P75          |      x.x      |      x.x    |      x.x     |
| P<<x>>                                       |      x.x     |      x.x      |      x.x    |              |
|                                              |              |               |             |              |
| Comparison of treatment groups [g]           | Hazard ratio |      x.x      |      x.x    |              |
|                                              | <<x>>% CI    | x.x, x.x      | x.x, x.x    |              |
|                                              | <<x>>% CI    | x.x, x.x      | x.x, x.x    |              |
|                                              | p-value      |      0.xxx    |      0.xxx  |              |
|                                              |              |               |             |              |
|                                              |              |               |             |              |
| Progression-free survival rate [e]           |              |               |             |              |
| <<xx months>>                                | %            |     xx.x      |     xx.x    |      xx.x    |
|                                              | <<x>>% CI    | x.x, x.x      |   x.x, x.x  |     x.x, x.x |
|                                              |              |               |             |              |
| <<xx months>>                                | %            |     xx.x      |     xx.x    |      xx.x    |
|                                              | <<x>>% CI    | x.x, x.x      |   x.x, x.x  |     x.x, x.x |
|                                              | …            |               |             |              |
|                                              |              |               |             |              |
| Missed two or more consecutive               | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| <<RECIST>> assessments                       |              |               |             |              |
|                                              |              |               |             |              |
| Duration between <<RECIST>> progression      | n            |      x        |      x      |      x       |
| and the last evaluable <<RECIST>>            | Min          |     xx.x      |     xx.x    |     xx.x     |
| assessment prior to progression (<<unit>>)   | Q1           |      x.x      |      x.x    |      x.x     |
|                                              | Median       |     xx.x      |     xx.x    |     xx.x     |
|                                              | Q3           |     xx.x      |     xx.x    |     xx.x     |
|                                              | Max          |     xx        |     xx      |     xx       |`;

const highlightMap = [
  {
    code: 'effcount',
    start: 'Event [a]',
    end: '<<category>>',
    extra: {
      start: 'Missed two or more consecutive',
      end: '<<RECIST>> assessments'
    }
  },
  {
    code: 'km',
    start: 'Progression-free survival',
    end: 'P<<x>>',
    extra: {
      start: 'Progression-free survival rate',
      end: '…'
    }
  },
  {
    code: 'cox',
    start: 'Comparison of treatment groups [g]',
    end: 'p-value'
  },
  {
    code: 'popn',
    start: '|                                              |              | AZD1          | AZD2        |              |',
    end: '|                                              |              |N=xxx          | N=xxx       | N=xxx        |'
  }
];

const AZTONCEF04open: React.FC<{ theme: any }> = ({ theme }) => {
  const [code, setCode] = useState(sasCode);
  const [highlightBlock, setHighlightBlock] = useState<string | null>(null);
  const codeMirrorRef = useRef<any>(null);

  const handleCodeMirrorChange = (value: string) => {
    setCode(value);
  };

  const handleCodeMirrorUpdate = (view: any) => {
    const pos = view.state.selection.main.head;
    const line = view.state.doc.lineAt(pos);
    const text = line.text;
    if (text.includes('effcount')) {
      setHighlightBlock('effcount');
    } else if (text.includes('cox')) {
      setHighlightBlock('cox');
    } else if (text.includes('km')) {
      setHighlightBlock('km');
    } else if (text.includes('m_u_popn')) {
      setHighlightBlock('popn');
    } else {
      setHighlightBlock(null);
    }
  };

  // 处理表格高亮逻辑
  let highlightRows: Set<number> = new Set();
  const lines = markdownTable.split('\n');
  const block = highlightMap.find(b => b.code === highlightBlock);
  if (block) {
    // 主区间
    let start = -1, end = -1;
    for (let i = 0; i < lines.length; i++) {
      if (start === -1 && lines[i].includes(block.start)) start = i;
      if (start !== -1 && end === -1 && lines[i].includes(block.end)) end = i;
    }
    if (start !== -1 && end !== -1 && end >= start) {
      for (let i = start; i <= end; i++) highlightRows.add(i);
    }
    // 额外区间（如果存在）
    if (block.extra) {
      let s2 = -1, e2 = -1;
      for (let i = 0; i < lines.length; i++) {
        if (s2 === -1 && lines[i].includes(block.extra.start)) s2 = i;
        if (s2 !== -1 && e2 === -1 && lines[i].includes(block.extra.end)) e2 = i;
      }
      if (s2 !== -1 && e2 !== -1 && e2 >= s2) {
        for (let i = s2; i <= e2; i++) highlightRows.add(i);
      }
    }
  }

  // 渲染表格时高亮对应行
  const renderMarkdownTable = () => {
    return (
      <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
        <tbody>
          {lines.map((line, idx) => {
            if (!line.trim().startsWith('|')) return null;
            const cells = line.split('|').slice(1, -1);
            return (
              <tr key={idx} style={highlightRows.has(idx) ? { background: '#ffe9b3' } : {}}>
                {cells.map((cell, cidx) => (
                  <td key={cidx} style={{ border: '1px solid #d0d7de', padding: '3px 6px', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'pre', fontFamily: 'Balancing Simplicity' }}>{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <Slide title="AZTONCEF04 Open Code Template">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start', width: '100%' }}>
        {/* 左侧markdown表格 */}
        <Paper sx={{ flex: 1, minWidth: 420, maxWidth: 800, p: 2, bgcolor: '#fafbfc', boxShadow: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderMarkdownTable()}
          </Box>
        </Paper>
        {/* 右侧代码编辑器 */}
        <Paper sx={{ flex: 1, minWidth: 320, maxWidth: 600, p: 2, bgcolor: '#181c24', color: '#fff', boxShadow: 2, display: 'flex', flexDirection: 'column', height: '60vh' }}>
          <Typography variant="subtitle1" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>SAS Macro</Typography>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <CodeMirror
              ref={codeMirrorRef}
              value={code}
              height="100%"
              theme="dark"
              extensions={[sql()]}
              onChange={handleCodeMirrorChange}
              onUpdate={handleCodeMirrorUpdate}
              style={{ minHeight: '400px', width: '100%', background: '#181c24', color: '#fff', fontSize: '0.92rem', borderRadius: 6 }}
            />
          </Box>
        </Paper>
      </Box>
    </Slide>
  );
};

export default AZTONCEF04open; 