import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const project = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'));

test('Package and lockfile keep the project identity and dependency declarations aligned', () => {
  assert.equal(project.name, 'dhebe-studios');
  assert.equal(lock.name, project.name);
  assert.equal(lock.packages[''].name, project.name);
  assert.deepEqual(lock.packages[''].dependencies, project.dependencies);
  assert.deepEqual(lock.packages[''].devDependencies, project.devDependencies);
  assert.equal(project.license, 'SEE LICENSE IN LICENSE');
  assert.equal(lock.packages[''].license, project.license);
});

test('Documented Node version and production preview match the package scripts', async () => {
  assert.equal((await readFile(new URL('.nvmrc', root), 'utf8')).trim(), '24');
  assert.equal(project.scripts.start, 'node scripts/serve-static.mjs');
  assert.equal(project.scripts.preview, project.scripts.start);
});

test('Primary repository documentation has no missing relative file links', async () => {
  for (const name of ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'PDF_TOOLS_DEPLOYMENT.md', 'PDF_TOOLS_FEATURES.md', 'STUDIOS_HUB_README.md']) {
    const file = new URL(name, root);
    const content = await readFile(file, 'utf8');
    for (const [, target] of content.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
      if (/^(?:https?:|mailto:|#)/.test(target)) continue;
      await assert.doesNotReject(access(new URL(target.split('#')[0], file)), `${name}: ${target}`);
    }
  }
});

test('CI uses pinned actions and read-only repository permissions', async () => {
  const workflow = await readFile(new URL('.github/workflows/ci.yml', root), 'utf8');
  const actions = [...workflow.matchAll(/uses:\s+(\S+)/g)];
  assert.ok(actions.length >= 3);
  for (const [, action] of actions) assert.match(action, /^[\w/-]+@[a-f0-9]{40}$/);
  assert.match(workflow, /permissions:\s*\n\s+contents: read/);
  assert.doesNotMatch(workflow, /pull_request_target|secrets\./);
});
