#!/usr/bin/env node
// Moldura · etapa 2: monta as lâminas finais a partir do storyboard.
// Uso (dentro de modelos/remotion): node scripts/montar.mjs ../../producoes/<pasta> [--so 1,3]
//   --so: renderiza só algumas lâminas (números a partir de 1), para revisão rápida.
// Resultado: <producao>/final/lamina-N.jpg
import {readFileSync, writeFileSync, mkdirSync, cpSync, existsSync} from 'node:fs';
import {join, resolve, basename} from 'node:path';
import {execFileSync} from 'node:child_process';

const prod = resolve(process.argv[2] ?? '');
const so = process.argv.includes('--so') ? process.argv[process.argv.indexOf('--so') + 1].split(',').map(Number) : null;
const sb = JSON.parse(readFileSync(join(prod, '07-storyboard.json'), 'utf8'));
const kit = resolve('../../marcas', sb.marca);
const identidade = JSON.parse(readFileSync(join(kit, 'identidade.json'), 'utf8'));

// Copia fontes, logo e imagens para public/producao/<slug> (o Remotion só lê de public/)
const slug = basename(prod);
const pub = join('public', 'producao', slug);
mkdirSync(pub, {recursive: true});
for (const f of Object.values(identidade.fontes)) cpSync(join(kit, 'fontes', f.arquivo), join(pub, f.arquivo));
cpSync(join(kit, identidade.logo), join(pub, identidade.logo));
for (const l of sb.laminas) {
  const img = join(prod, 'imagens', l.imagem);
  if (!existsSync(img)) throw new Error(`Imagem não encontrada: ${img} (rode preparar-imagens.py antes)`);
  cpSync(img, join(pub, l.imagem));
}

const props = {pasta: `producao/${slug}`, identidade, laminas: sb.laminas};
const arqProps = join('out', `${slug}.props.json`);
mkdirSync('out', {recursive: true});
writeFileSync(arqProps, JSON.stringify(props));
mkdirSync(join(prod, 'final'), {recursive: true});

sb.laminas.forEach((_, i) => {
  if (so && !so.includes(i + 1)) return;
  const png = join('out', `${slug}-${i + 1}.png`);
  execFileSync('npx', ['remotion', 'still', 'src/index.ts', 'Carrossel', png, `--frame=${i}`, `--props=${arqProps}`], {stdio: 'inherit'});
  execFileSync('python3', ['-I', '-c', `from PIL import Image;Image.open(r'${png}').convert('RGB').save(r'${join(prod, 'final', `lamina-${i + 1}.jpg`)}',quality=92)`]);
  console.log(`lâmina ${i + 1} pronta`);
});
