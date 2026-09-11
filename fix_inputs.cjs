const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if (file.endsWith('.tsx')) filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

const files = walkSync('./src/components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Pattern 1: onChange={(e) => onChange({ prop: parseFloat(e.target.value) || 0 })}
  // Pattern 2: onChange={(e) => onChange({ prop: parseInt(e.target.value, 10) || 123 })}
  // Pattern 3: onChange={e => updateState({ prop: Number(e.target.value) })}
  
  // We can just replace:
  // e.target.value  ->  e
  // Number(e) -> e
  // parseFloat(e) || X -> e
  // parseInt(e, 10) || X -> e
  
  // Actually, since NumericInput passes a number (val), we can just replace the whole onChange prop for NumericInput.
  // Wait, some inputs are NOT NumericInput (like select or text input).
  // If we just look for <NumericInput ... onChange={...} /> and replace the onChange content.
  // It's easier to just use regex on the content.
  
  content = content.replace(/onChange=\{\(?e\)?\s*=>\s*onChange\(\{\s*([a-zA-Z0-9_]+):\s*(?:parseFloat|parseInt|Number)\(e\.target\.value(?:,\s*10)?\)(?:\s*\|\|\s*[0-9.]+)?\s*\}\)\}/g, "onChange={val => onChange({ $1: val })}");
  
  content = content.replace(/onChange=\{\(?e\)?\s*=>\s*updateState\(\{\s*([a-zA-Z0-9_]+):\s*(?:parseFloat|parseInt|Number)\(e\.target\.value(?:,\s*10)?\)(?:\s*\|\|\s*[0-9.]+)?\s*\}\)\}/g, "onChange={val => updateState({ $1: val })}");

  // double fields: flowRate: parseFloat(e.target.value) || 0, nktFlowQ: parseFloat(e.target.value) || 0
  content = content.replace(/onChange=\{\(?e\)?\s*=>\s*onChange\(\{\s*([a-zA-Z0-9_]+):\s*(?:parseFloat|parseInt|Number)\(e\.target\.value(?:,\s*10)?\)(?:\s*\|\|\s*[0-9.]+)?,\s*([a-zA-Z0-9_]+):\s*(?:parseFloat|parseInt|Number)\(e\.target\.value(?:,\s*10)?\)(?:\s*\|\|\s*[0-9.]+)?\s*\}\)\}/g, "onChange={val => onChange({ $1: val, $2: val })}");

  // for updateAnnulusInterval(item.id, { casingDe: Number(e.target.value) })
  content = content.replace(/onChange=\{\(?e\)?\s*=>\s*updateAnnulusInterval\(item\.id,\s*\{\s*([a-zA-Z0-9_]+):\s*Number\(e\.target\.value\)\s*\}\)\}/g, "onChange={val => updateAnnulusInterval(item.id, { $1: val })}");
  
  content = content.replace(/onChange=\{\(?e\)?\s*=>\s*updateTubingInterval\(item\.id,\s*\{\s*([a-zA-Z0-9_]+):\s*Number\(e\.target\.value\)\s*\}\)\}/g, "onChange={val => updateTubingInterval(item.id, { $1: val })}");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
