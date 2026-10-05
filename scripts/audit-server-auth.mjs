import { execFile } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const source = readFileSync('prisma/schema.prisma', 'utf8')
const expected = []
for (const model of source.matchAll(/model (\w+) \{([\s\S]*?)\n\}/g)) {
    for (const field of model[2].matchAll(/^\s+(\w+)\s+(String|DateTime|Int|Float|Boolean|Json)\??(?:\s|$)/gm)) expected.push([model[1], field[1]])
}
const program = `
const { Pool } = require('pg');
(async () => {
 const url = new URL(process.env.DATABASE_URL);
 const schema = url.searchParams.get('schema') || 'public';
 const pool = new Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:5000,query_timeout:10000});
 try {
  const {rows} = await pool.query('SELECT table_name,column_name FROM information_schema.columns WHERE table_schema=$1',[schema]);
  const expected = ${JSON.stringify(expected)};
  console.log(JSON.stringify({databaseConnected:true,schema,missingColumns:expected.filter(([table,field])=>!rows.some(row=>row.table_name===table&&row.column_name===field)).map(([table,field])=>table+'.'+field)}));
 } catch(error) {console.log(JSON.stringify({databaseConnected:false,code:error.code,name:error.name}));}
 finally {await pool.end();}
})();`
const child = execFile('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', 'hetzner-constelatii', 'docker exec -i invitonline node'], { windowsHide: true, timeout: 20000 }, (error, stdout, stderr) => {
    if (stdout) process.stdout.write(stdout)
    if (error) { console.log(JSON.stringify({ inspectionFailed: true, code: error.code, detail: stderr.includes('Cannot find module') ? 'Container dependency unavailable' : 'SSH or container inspection failed' })); process.exitCode = 1 }
})
child.stdin.end(program)
const { stdout } = await exec('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', 'hetzner-constelatii', 'docker logs --since 24h --tail 500 invitonline 2>&1'], { windowsHide: true, timeout: 20000 })
console.log(JSON.stringify({ registerErrors: (stdout.match(/Register error:/g) || []).length, prismaErrorCodes: [...new Set(stdout.match(/\bP\d{4}\b/g) || [])], missingColumnsInLog: [...new Set([...stdout.matchAll(/column [`"']?([\w.]+)[`"']? does not exist/gi)].map(match => match[1]))], connectionFailure: /ECONNREFUSED|Can't reach database server|Connection terminated due to connection timeout/.test(stdout) }))
