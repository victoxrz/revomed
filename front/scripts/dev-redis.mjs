import { execFileSync } from 'node:child_process';

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: 'inherit', shell: false });
}

function output(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', shell: false }).trim();
}

try {
  const state = output('podman', ['machine', 'inspect', '--format', '{{.State}}']);
  if (state !== 'running') {
    run('podman', ['machine', 'start']);
  }
} catch {
  run('podman', ['machine', 'start']);
}

try {
  const running = output('podman', ['inspect', 'redis', '--format', '{{.State.Running}}']) === 'true';
  if (!running) {
    run('podman', ['start', 'redis']);
  }
} catch {
  run('podman', ['run', '-d', '--name', 'redis', '-p', '6379:6379', 'redis:7-alpine']);
}