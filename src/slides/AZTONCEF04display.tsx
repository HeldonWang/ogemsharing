import React, { useState, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Slide from '../components/Slide';
import ReactMarkdown from 'react-markdown';
// 你需要安装react-codemirror2和@uiw/codemirror-theme-sublime、@codemirror/lang-sql
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import remarkGfm from 'remark-gfm';

const sasCode = `%m_t_aztoncef04(
    /*public*/
     inds                   =    adtte
    ,whr                   =    paramcd='TRPROGM' and parqual='INDEPENDENT ASSESSOR'
    ,pop_flag              =    mittfl='Y'
    ,pop_mvar              =    ittdummyn2
    ,trtgrpn               =    trt01pN         
    ,var                   =    aval
    ,alpha                 =    0.05
    /*,pair                 =    1-2|4-2|6-2|5-2|7-2*/
    ,pair                  =    1-5|4-5|6-5|3-5|7-5
    ,debug                 =   Y
    /*effcount*/   
    ,effcount_index        =   {cond=CNSR=0 # label=%nrbquote(Total events [a], n (%)) #level=0 subord=1}
                                  {cond=cnsr=0 and find(evntdesc,'RECIST progression')  # label=RECIST progression #level=1 subord=2}
                                  {cond=cnsr=0 and find(evntdesc,'RECIST progression with target') # label=Target lesion [b] #level=2 subord=3}
                                  {cond=cnsr=1 label=%nrbquote(Censored patients, n (%)) #level=0 subord=4}
                                  {cond=cnsr=1 and find(evntdesc,'Censored RECIST progression')  # label=Censored RECIST progression [c] #level=1 /*section=6*/ subord=5}
                          
    /*cox, logrank*/
    ,coxlog_blocklbl       =   Comparison of treatment groups [g]
    ,coxlog_modelkey       =   cox|logrank            
    ,coxlog_strata         =   STRAT1 STRAT2                                                                          
       
    /*km*/     
    ,km_method             =   km
    ,km_conftype           =   log 
    ,km_cen_num            =   0
    ,km_step_list          =   160 to 1686 by 160
    ,km_step_unit          =   days
    ,km_median_label       =   Progression-free survival (days) [e] [f]
    ,km_timelist_label     =   Progression-free survival rate [e]
    /*desc_stat*/        
    ,desc_stat_inds            =   adtte
    ,desc_stat_whr             =  %str(paramcd='TRTTFST' and mittfl='Y')
    ,desc_stat_var             =  aval
    ,desc_stat_label           =  %str(Duration between <<RECIST>> progression and the last evaluable <<RECIST>>  assessment prior to progression (<<unit>>))

    /*report*/
    , lenlist                  =  20#7#10#10#10#10#10#10 
    , justlist                 =  l#l#c#c#c#c#c#c 
    , justlist_header          =  l#l#c#c#c#c#c#c 
    , nolblist                 =  Y#N#N#N#N#N#N#N 
    , orderlist                =  N#N#N#N#N#N#N#N
    , defcol                   =  (col1 col2 col3 col5 col6 col7 col8 col4)
    , rtf                      =  y
    , sfx                      =  a
);
`;

// 你需要将aztoncef04.md内容以字符串形式引入
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
| Censored observations                        |              |               |
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
| P<<x>>                                       |      x.x     |      x.x      |      x.x    |
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
| <<xx months>>                                | %            |     xx.x      |     xx.x    |      xx.x    |
|                                              | <<x>>% CI    | x.x, x.x      |   x.x, x.x  |     x.x, x.x |
|                                              | …            |               |             |              |
|                                              |              |               |             |              |
|                                              |              |               |             |              |
|                                              |              |               |             |              |
| Missed two or more consecutive               | n (%)        |   x (x.x)     |   xx (xx.x) |   x (x.x)    |
| <<RECIST>> assessments                       |              |               |             |              |
|                                              |              |               |             |              |
| Duration between <<RECIST>> progression      | n            |      x        |      x      |      x       |
| and the last evaluable <<RECIST>>            | Min          |     xx.x      |     xx.x    |     xx.x     |
| assessment prior to progression (<<unit>>)   | Q1           |      x.x      |      x.x    |      x.x     |
|                                              | Median       |     xx.x      |     xx.x    |     xx.x     |
|                                              | Q3           |     xx.x      |     xx.x    |     xx.x     |
|                                              | Max          |     xx        |     xx      |     xx       |
`;

const effcountStart = 'Event [a]';
const effcountEnd = '<<category>>';

const highlightMap = [
  {
    code: 'effcount',
    start: 'Event [a]',
    end: '<<category>>',
  },
  {
    code: 'cox',
    start: 'Comparison of treatment groups [g]',
    end: 'p-value',
  },
  {
    code: 'km',
    start: 'Progression-free survival',
    end: 'P<<x>>',
    extra: {
      start: 'Progression-free survival rate',
      end: '…', // 以第一个…为止
    },
  },
];

const AZTONCEF04display: React.FC<{ theme: any }> = ({ theme }) => {
  const [code, setCode] = useState(sasCode);
  const [highlightBlock, setHighlightBlock] = useState<string | null>(null);
  const codeMirrorRef = useRef<any>(null);

  // 监听CodeMirror光标活动
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
    // km区块的extra区间
    if (block.code === 'km' && block.extra) {
      let s2 = -1, e2 = -1;
      for (let i = 0; i < lines.length; i++) {
        if (s2 === -1 && lines[i].includes(block.extra.start)) s2 = i;
        if (s2 !== -1 && e2 === -1 && lines[i].trim().startsWith('|') && lines[i].includes(block.extra.end)) e2 = i;
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
    <Slide title="AZTONCEF04 Display Macro">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start', width: '100%' }}>
        {/* 左侧markdown表格 */}
        <Paper sx={{ flex: 1, minWidth: 420, maxWidth: 800, p: 2, bgcolor: '#fafbfc', boxShadow: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderMarkdownTable()}
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
            Utility macros: m_u_km / m_u_cox_logrank / m_u_effcount
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

export default AZTONCEF04display; 