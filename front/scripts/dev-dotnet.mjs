import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const cwd = resolve(process.cwd(), '../back/src/PublicApi');

const child = spawn('dotnet', ['run'], {
  cwd,
  stdio: 'inherit',
  shell: false
});

child.on('exit', code => process.exit(code ?? 0));