import React, { useState, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Slide from '../components/Slide';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';

const sasCode = `%m_t_aztoncef02(
    inds=adeff_all
    , adsl= adsl_all
    , trtgrpn= trt01pn
    , trtgrp= trt01p
    , trtfmt=
    , pop_flag= ittfl='Y'
    , whr= paramcd='TRORESPU' and OTLVBPFL='Y' and PARQUAL='INDEPENDENT ASSESSOR'
    , strata= strat1n strat2n
    , event=
    , var=
    , reportout= Y
    , debug= N
    , rate_ci= N
    , rate_alpha= 0.05
    , rate_decim=
    , rate_missval= 
    , rate_adj= Y
    , rate_adj_alpha= 0.05
    , rate_adj_cidecim=
    , rate_adj_missval=
    , odds= Y
    , cmh= N
    , trtpair= 1-3|2-3
    , cal_alpha=
    , cal_pside=
    , cal_pdecim=
    , cal_cidecim=
    , cal_missval= 
    , cmh_cltype=
    , collabel= col1='Group' col2='Number (%)' col3='Estimate' col4='95% CI' col5='Odds ratio' col6='95% CI' col7='p-value'
    , lenlist = 27#12#12#12#12#12#12
    , justlist = l#c#c#c#c#c#c
    , justlist_header = l#c#c#c#c#c#c
    , nolblist = Y#N#N#N#N#N#N
    , orderlist = Y#N#N#N#N#N#N
    , defcol = (col1) ("(*ESC*)S={just = center borderbottomwidth=0pt MARGINBOTTOM= 2pt}Subjects with response(*ESC*)S={}"col2) ("(*ESC*)S={just = center borderbottomwidth=0pt MARGINBOTTOM= 2pt}Adjusted rate (%)(*ESC*)S={}" col3 col4) ("(*ESC*)S={just = center borderbottomwidth=0pt MARGINBOTTOM= 2pt}Comparison of treatment groups(*ESC*)S={}" col5 col6 col7)
    , pg= 18
    , blank_after=
    , sfx = a
);
`;

const markdownTable = `|                          |                                         |                   |           |                                |           |         |
| ------------------------ | ---------------------------------------- | ----------------- | --------- | ------------------------------ | --------- | ------- |
|                          | Subjects with [[objective respons etc.]] | Adjusted rate (%) |           | Comparison of treatment groups |           |         |
|                          |                                          |                   |           |                                |           |         |
| Group                    | Number (%)                               | Estimate          | <<x>>% CI | Odds ratio                     | <<x>>% CI | p-value |
| AZD1 <<low dose>> N=xxx  | xx (xx.x)                                | xx.x              | x.x, x.x  | x.x                            | x.x, x.x  | 0.xxx   |
|                          |                                          |                   |           |                                |           |         |
| AZD2 <<high dose>> N=xxx | xx (xx.x)                                | xx.x              | x.x, x.x  | x.x                            | x.x, x.x  | 0.xxx   |
| Control N=xxx            | xx (xx.x)                                | xx.x              | x.x, x.x  |                                |           |         |
| …                        |                                          |                   |           |                                |           |         |`;

const markdownTable2 = `|                    | Relative risk |            | Risk difference |            |         |
| ------------------ | ------------- | ---------- | --------------- | ---------- | ------- |
| Group              | Estimate      | <<x>>% CI  | Estimate        | <<x>>% CI  | p-value |
| AZD1 <<low dose>>  | xx.x          | xx.x, xx.x | xx.x            | xx.x, xx.x | 0.xxx   |
| N=xxx              |               |            |                 |            |         |
|                    |               |            |                 |            |         |
| AZD2 <<high dose>> | xx.x          | xx.x, xx.x | xx.x            | xx.x, xx.x | 0.xxx   |
| N=xxx              |               |            |                 |            |         |
|                    |               |            |                 |            |         |
| Control            |               |            |                 |            |         |
| N=xxx              |               |            |
| …                  |               |            |                 |            |         |`;

const highlightMap = [
  {
    code: 'rate_',
    table: 1,
    cols: [1], // ef02a第2列
  },
  {
    code: 'rate_adj',
    table: 1,
    cols: [2, 3], // ef02a第3、4列
  },
  {
    code: 'odds',
    table: 1,
    cols: [4, 5, 6], // ef02a第5-7列
  },
  {
    code: 'cmh',
    table: 2,
    cols: [1, 2, 3, 4, 5], // ef02b第2-6列
  },
];

const AZTONCEF02aDisplay: React.FC<{ theme: any }> = ({ theme }) => {
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
    if (text.includes('odds')) {
      setHighlightBlock('odds');
    } else if (text.includes('rate_adj')) {
      setHighlightBlock('rate_adj');
    } else if (text.includes('cmh')) {
      setHighlightBlock('cmh');
    } else if (text.includes('rate_')) {
      setHighlightBlock('rate_');
    } else {
      setHighlightBlock(null);
    }
  };

  // 渲染表格时高亮对应列
  const renderMarkdownTable = (table: string, tableIdx: number, title: string) => {
    const lines = table.split('\n');
    const block = highlightMap.find(b => b.code === highlightBlock && b.table === tableIdx);
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', marginBottom: 16 }}>
          <tbody>
            {lines.map((line, idx) => {
              if (!line.trim().startsWith('|')) return null;
              const cells = line.split('|').slice(1, -1);
              return (
                <tr key={idx}>
                  {cells.map((cell, cidx) => {
                    const highlight = block && block.cols && block.cols.includes(cidx);
                    return (
                      <td key={cidx} style={{ border: '1px solid #d0d7de', padding: '3px 6px', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'pre', fontFamily: 'Balancing Simplicity', background: highlight ? '#ffe9b3' : undefined }}>{cell}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    );
  };

  return (
    <Slide title="AZTONCEF02 Display Macro">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start', width: '100%' }}>
        {/* 左侧markdown表格 */}
        <Paper sx={{ flex: 1, minWidth: 420, maxWidth: 800, p: 2, bgcolor: '#fafbfc', boxShadow: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderMarkdownTable(markdownTable, 1, 'ef02a')}
            {renderMarkdownTable(markdownTable2, 2, 'ef02b')}
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2, 
              color: 'text.secondary',
              fontStyle: 'italic',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Utility macros: m_u_binom_odds / m_u_binom_cp_grp / m_u_binom_adjrate
          </Typography>
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

export default AZTONCEF02aDisplay; 