import React, { useState, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Slide from '../components/Slide';
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import remarkGfm from 'remark-gfm';

const sasCode = `%setup(version=260,
       localsetup=root/%scan(&_exec_programpath.,2,/)/%scan(&_exec_programpath.,3,/)/%scan(&_exec_programpath.,4,/)/ar/%scan(&_exec_programpath.,6,/)/common/%scan(&_exec_programpath.,8,/)/macro/localsetup.sas);

** Remove call to localsetup macro if it is not needed **;
%localsetup;
***********************************************************************************************;
* Setup analysis datasets;
***********************************************************************************************;
data adsl;
    set adam.adsl;
    where ittfl='Y';
    if trt01pn=2 then trt01pn=3;
run;
data adsl_dummy;
    set adsl;
    num=_n_;
    if int(num/5)=num/5;
    trt01pn=2;
    trt01p='DummyDrug';
    usubjid=tranwrd(tranwrd(tranwrd(usubjid,'1','2'),'0','3'),'4','5');
    drop num;
run;
data adsl_all;
    set adsl adsl_dummy;
    proc sort;by usubjid;
run;
data adeff_anl;
    set adam.adeff;
    if trt01pn=2 then trt01pn=3;
    where ittfl='Y' and paramcd='TRORESPU' and OTLVBPFL='Y' and PARQUAL='INDEPENDENT ASSESSOR';
run;
data dummy;
    set adeff_anl;
    num=_n_;
    if int(num/5)=num/5;
    trt01pn=2;
    trt01p='DummyDrug';
    usubjid=tranwrd(tranwrd(tranwrd(usubjid,'1','2'),'0','3'),'4','5');
    drop num;
run;
data adeff_all;
    set adeff_anl dummy;
    proc sort;by usubjid;
run;

***********************************************************************************************;
*Calculation section;
***********************************************************************************************;
*****calculation of rate*****;
%m_u_binom_cp_grp(inds=adeff_all
                ,byvar = trt01p
                ,adsl=adsl_all
                ,alpha = 0.05
                ,final_ds = final_est
                ,debug = Y);

****************************************************************;
* Adjusted rate calculation;
****************************************************************; 
%m_u_binom_adjrate(
                   inds=adeff_all,
                   outds=final_adjrate,
                   trtgrpn=trt01pn,
                   strata=strat1n strat2n,
                   where=,
                   var=aval,
                   event=1,
                   alpha=0.01,
                   missval=NR,
                   cidecim=3,
                   debug=Y
                   );

***********************************************************************************************;
* Odds ratio/Relative risk/Risk diff calculation;
***********************************************************************************************;				 
%m_u_binom_odds (
				/******Dataset related parameter******/
				inds= adeff_all,/*Required*/
				whr= paramcd='TRORESPU' and OTLVBPFL='Y' and PARQUAL='INDEPENDENT ASSESSOR',/*Optional*/
				pop_flag= ittfl='Y',/*Required*/
				
				/******Analysis related parameter******/
				trtgrpn=trt01pn,/*Required*/
				trtgrp=trt01p, /*(for creating fromat automatically)*/
				trtpair=1 3,/*For 2by 2 compare,optional ie.str(1,2) or 1 2*/
				trtfmt= , /*Optional, if trtgrpn=trt01pn then will automatically create format */
				trtref= 3,/*Required*/
				strata= strat1n strat2n, /*Optional, just input strata1 strata2*/
				var= aval,/*Optional default is aval*/
				event= 1,/*Optional default=1*/
				alpha= 0.05,/*Optional default=0.05*/
				pvalside= 2,/*set the p value sided, default is 2 sided.*/
				pvdecim=2,/*Optional default=2*/
				cidecim=2,/*Optional default=2*/
				
				/******Relative risk/risk diff related parameter******/
				relcal=Y,/*Default is N, use Y to get relative risk calculation.*/
				cltype=, /*Optional defaulted by Miettinen-Nurminen method to calculate the CI*/
				supds=,/*Optional for creating dummy dataset when some treatment or aval is 0*/
				/*Output and debug related parameter*/
				missval=NE,/*NR,NE,NA. default is NA*/
				
				/******Dataset and macro related parameter******/
				ord=1,/*Required*/
				debug=Y
						); 
%m_u_binom_odds (
				/*Dataset related parameter*/
				inds= adeff_all,/*Required*/
				whr= paramcd='TRORESPU' and OTLVBPFL='Y' and PARQUAL='INDEPENDENT ASSESSOR',/*Optional*/
				pop_flag= ittfl='Y',/*Required*/
				/*Analysis related parameter*/
				trtgrpn=trt01pn,/*Required*/
				trtgrp=trt01p, /*(for creating fromat automatically)*/
				trtpair=2 3,/*For 2by 2 compare,optional ie.str(1,2) or 1 2*/
				trtfmt= , /*Optional, if trtgrpn=trt01pn then will automatically create format */
				trtref= 3,/*Required*/
				strata= strat1n strat2n, /*Optional, just input strata1 strata2*/
				var= aval,/*Optional default is aval*/
				event= 1,/*Optional default=1*/
				alpha= 0.05,/*Optional default=0.05*/
				pvalside= 2,/*set the p value sided, default is 2 sided.*/
				pvdecim=2,/*Optional default=2*/
				cidecim=2,/*Optional default=2*/
				/*Relative risk/risk diff related parameter*/
				relcal=Y,/*Default is N, use Y to get relative risk calculation.*/
				cltype=, /*Optional defaulted by Miettinen-Nurminen method to calculate the CI*/
				supds=,/*Optional for creating dummy dataset when some treatment or aval is 0*/
				/*Output and debug related parameter*/
				missval=NE,/*NR,NE,NA. default is NA*/
				ord=2,/*Required*/
				debug=Y
						); 						   
***********************************************************************************************;
* Handle with the final datasets;
***********************************************************************************************;
data est_all;
	set final_est;
	subord=sub_ord;
run;
data odds_all;
	set final_odds:;
	drop col_label;
run;
data cmh_all;
	set final_cmh:;
	drop col_label;
run;
data report_all;
	merge est_all odds_all cmh_all;
	by ord subord;
run;

%m_u_col_reorg(inds=report_all,/*Get set option in this macro, rename all the colin to macro defined content and renmae col out to col1-colx*/
			  outds=report_1
				);
%m_u_col_header(inds=report_1,outds=report,collabel=col1='Group' col2='Estimate' col3='95% CI' col4='Odds ratio' col5='95% CI' col6='p-value');
***********************************************************************************************;
* Report process;
***********************************************************************************************;
%let sfx=a;
option mprint mlogic;
%istartv2(SUFFIX=a);
%m_u_report(table=report,
	lenlist=28#12#12#12#12#12,    
	justlist=l#c#c#c#c#c,
	justlist_header=l#c#c#c#c#c,
	nolblist=Y#N#N#N#N#N,
	orderlist=Y#N#N#N#N#N,
	defcol=(col1 col2 col3 col4 col5 col6),
	blank_after = ord,
    pg=18);
%istopv2;

%let output = %scan(&_exec_programname.,1,".");
data tlf.&output.&sfx.;/**/
	set report_all;
	keep col:;
run;
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

const AZTONCEF02open: React.FC<{ theme: any }> = ({ theme }) => {
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
    if (text.includes('binom_cp_grp')) {
      setHighlightBlock('rate_');
    } else if (text.includes('binom_adjrate')) {
      setHighlightBlock('rate_adj');
    } else if (text.includes('binom_odds') && !text.includes('relcal')) {
      setHighlightBlock('odds');
    } else if (text.includes('relcal=Y')) {
      setHighlightBlock('cmh');
    } else {
      setHighlightBlock(null);
    }
  };

  // 获取当前高亮配置
  const block = highlightMap.find(b => b.code === highlightBlock);

  // 渲染表格时高亮对应行
  const renderMarkdownTable = (tableContent: string, tableIndex: number) => {
    const lines = tableContent.split('\n');
    return (
      <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', marginBottom: tableIndex === 1 ? '20px' : 0 }}>
        <tbody>
          {lines.map((line, idx) => {
            if (!line.trim().startsWith('|')) return null;
            const cells = line.split('|').slice(1, -1);
            return (
              <tr key={idx}>
                {cells.map((cell, cidx) => {
                  const isHighlighted = block?.table === tableIndex && block.cols.includes(cidx);
                  return (
                    <td 
                      key={cidx} 
                      style={{ 
                        border: '1px solid #d0d7de', 
                        padding: '3px 6px', 
                        textAlign: 'left', 
                        fontSize: '0.82rem', 
                        whiteSpace: 'pre', 
                        fontFamily: 'Balancing Simplicity',
                        background: isHighlighted ? '#ffe9b3' : 'transparent'
                      }}
                    >
                      {cell.trim()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <Slide title="AZTONCEF02 Open Code Template">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start', width: '100%' }}>
        {/* 左侧markdown表格 */}
        <Paper sx={{ flex: 1, minWidth: 420, maxWidth: 800, p: 2, bgcolor: '#fafbfc', boxShadow: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderMarkdownTable(markdownTable, 1)}
            {renderMarkdownTable(markdownTable2, 2)}
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

export default AZTONCEF02open; 