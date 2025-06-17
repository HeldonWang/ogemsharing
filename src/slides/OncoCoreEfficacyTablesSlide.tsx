import React, { useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Tabs, Tab } from '@mui/material';
import * as XLSX from 'xlsx';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import Slide from '../components/Slide';

const tableCategories = [
  {
    title: 'K-M Related',
    tables: ['AZTONCEF04', 'AZTONCEF06', 'AZTONCEF09'],
  },
  {
    title: 'Ratio Related',
    tables: ['AZTONCEF02A', 'AZTONCEF02B'],
  },
  {
    title: 'Time to Event Related',
    tables: ['AZTONCEF14'],
  },
  {
    title: 'Other',
    tables: ['AZTONCEF01', 'AZTONCEF03', 'AZTONCEF13', 'AZTONCEF05'],
  }
];

const excelFilePath = '/excel_sheets/O-GEM efficacy macro dev tracker.xlsx';
const supportedTables = ['AZTONCEF04', 'AZTONCEF02A', 'AZTONCEF14', 'AZTONCEF01'];

const tableDetails: Record<string, string> = {
  AZTONCEF01: "Best overall response <at timepoint> based on [[confirmed|unconfirmed]] response by [[blinded independent central review|independent central review|investigator assessment]]",
  AZTONCEF02A: "Objective response/Clinical benefit/Disease control rate <at x weeks> based on [[confirmed|unconfirmed]] response by [[blinded independent central review|independent central review|investigator assessment]] - [[sensitivity|supplementary]] analysis <<Subjects with measurable disease>>",
  AZTONCEF02B: "Objective response/Clinical benefit/Disease control rate <at x weeks> based on [[confirmed|unconfirmed]] response by [[blinded independent central review|investigator assessment]] - [[sensitivity|supplementary]] analysis <<Subjects with measurable disease>>",
  AZTONCEF03: "Duration and onset of [[objective response|response]] based on [[confirmed|unconfirmed]] response by [[blinded independent central review|independent central review|investigator assessment]]",
  AZTONCEF04: "Progression-free survival by [[blinded independent central review|independent central review|investigator assessment]]",
  AZTONCEF09: "Overall survival",
  AZTONCEF14: "Time to [[first subsequent therapy|second subsequent therapy|IP discontinuation]] or death",
  AZTONCEF17: "Second progression-free survival by [[blinded independent central review|independent central review|investigator assessment]]"
};

function renderWithGreen(text: string) {
  const parts = [];
  let lastIndex = 0;
  const regex = /\[\[(.*?)\]\]/g;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span style={{ color: '#00b96b', fontFamily: 'inherit' }} key={key++}>
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

// 自动计算每列最大内容宽度
function getColWidths(data: any[][], min = 80, max = 400) {
  if (!data || data.length === 0) return [];
  const colCount = data[0].length;
  const widths = [];
  for (let c = 0; c < colCount; c++) {
    let maxLen = min;
    for (let r = 0; r < data.length; r++) {
      const cell = data[r][c] ? String(data[r][c]) : '';
      maxLen = Math.max(maxLen, cell.length * 12 + 24); // 12px/字符+padding
    }
    widths.push(Math.min(maxLen, max));
  }
  return widths;
}

const OncoCoreEfficacyTablesSlide: React.FC<{ theme: any }> = ({ theme }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedTable, setSelectedTable] = useState(tableCategories[0].tables[0]);
  const [sheetData, setSheetData] = useState<any[][] | null>(null);
  const [merges, setMerges] = useState<any[]>([]);
  const [colWidths, setColWidths] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setSelectedTable(tableCategories[tabIndex].tables[0]);
  }, [tabIndex]);

  React.useEffect(() => {
    if (!supportedTables.includes(selectedTable)) {
      setSheetData(null);
      setMerges([]);
      setColWidths([]);
      return;
    }
    setLoading(true);
    fetch(excelFilePath)
      .then(res => res.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array', cellStyles: true });
        const ws = workbook.Sheets[selectedTable];
        if (ws) {
          console.log('当前sheet:', selectedTable);
          console.log('合并区域:', ws['!merges']);
          let json = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
          // 直接将所有合并区域都传递给Handsontable
          const merges = ws['!merges'] || [];
          const htMerges: any[] = merges.map((m: any) => ({
            row: m.s.r,
            col: m.s.c,
            rowspan: m.e.r - m.s.r + 1,
            colspan: m.e.c - m.s.c + 1
          }));
          // 补齐每一行到最大列数，且不小于合并区域最大列
          let maxCol = 0;
          (json as any[][]).forEach((row: any[]) => { if (row.length > maxCol) maxCol = row.length; });
          htMerges.forEach((m: any) => { if (m.col + m.colspan > maxCol) maxCol = m.col + m.colspan; });
          json = (json as any[][]).map((row: any[]) => {
            const newRow = [...row];
            while (newRow.length < maxCol) newRow.push('');
            return newRow;
          });
          setSheetData(json as any[][]);
          setColWidths(getColWidths(json));
          setMerges(htMerges);
        } else {
          setSheetData(null);
          setMerges([]);
          setColWidths([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setSheetData(null);
        setMerges([]);
        setColWidths([]);
        setLoading(false);
      });
  }, [selectedTable]);

  return (
    <Slide title="Onco core efficacy Tables Classification">
      <Paper sx={{ p: 3, minHeight: 500, boxShadow: 'none', background: 'transparent' }}>
        {/* 顶部Tab切换 */}
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ mb: 2, minHeight: 48, borderBottom: '2px solid #e0e0e0' }}
          TabIndicatorProps={{ style: { background: '#8B008B', height: 4 } }}
        >
          {tableCategories.map((cat, idx) => (
            <Tab
              key={cat.title}
              label={cat.title}
                  sx={{ 
                minHeight: 48,
                fontWeight: tabIndex === idx ? 700 : 500,
                color: tabIndex === idx ? '#8B008B' : '#444',
                bgcolor: tabIndex === idx ? '#f3e6f7' : 'transparent',
                borderRadius: '8px 8px 0 0',
                mx: 0.5,
                transition: 'all 0.2s',
                border: '2px solid transparent',
                borderBottom: tabIndex === idx ? 'none' : '2px solid #e0e0e0',
              }}
            />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', mt: 2 }}>
          {/* 左侧表名列表 */}
          <Box sx={{ minWidth: 260, maxWidth: 340 }}>
            {tableCategories[tabIndex].tables.map(name => (
              <Box key={name} sx={{ mb: 2 }}>
                <Button
                  variant={selectedTable === name ? 'contained' : 'outlined'}
                  color="primary"
                  size="small"
                  sx={{ mb: 0.5, width: '100%', justifyContent: 'flex-start', fontWeight: 500, textTransform: 'none', whiteSpace: 'normal', wordBreak: 'break-word' }}
                  onClick={() => setSelectedTable(name)}
                  disabled={false}
                >
                  {name}
                </Button>
                {tableDetails[name] && (
                  <Typography variant="caption" sx={{ display: 'block', color: '#666', pl: 2, pr: 1, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {renderWithGreen(tableDetails[name])}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
          {/* 右侧Excel表格展示 */}
          <Box sx={{ flex: 1, minWidth: 320, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafbfc' }}>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                <CircularProgress />
          </Box>
            ) : sheetData && sheetData.length > 0 ? (
              <div style={{ width: '100%', minWidth: 600, height: 600, background: '#fff', borderRadius: 6, overflow: 'auto', border: '1px solid #e0e0e0' }}>
                <HotTable
                  data={sheetData}
                  colHeaders={true}
                  rowHeaders={true}
                  width="100%"
                  height={580}
                  stretchH="all"
                  mergeCells={merges}
                  colWidths={colWidths}
                  licenseKey="non-commercial-and-evaluation"
                  readOnly={true}
                  className="custom-excel-grid"
                  cells={(row, col) => {
                    if (["AZTONCEF04", "AZTONCEF14", "AZTONCEF01"].includes(selectedTable)) {
                      if (row === 1) {
                        return { className: 'htBorderTopThick' };
                      }
                      if (row === 3) {
                        return { className: 'htBorderBottomThick' };
                      }
                    }
                    return {};
                  }}
                />
              </div>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                No Excel data for this table.
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
      <style>{`
        .custom-excel-grid .htCore td,
        .custom-excel-grid .htCore th {
          border: 1px solid #bdbdbd !important;
        }
        .custom-excel-grid .htBorderTopThick {
          border-top: 3px solid #222 !important;
        }
        .custom-excel-grid .htBorderBottomThick {
          border-bottom: 3px solid #222 !important;
        }
      `}</style>
    </Slide>
  );
};

export default OncoCoreEfficacyTablesSlide;