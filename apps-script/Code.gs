const DM_PASSWORT = 'HIER-DEIN-PASSWORT';
const ORDNER = 'Siegelrolle';
const MAX_CHARAKTERE = 200;

function doGet() {
  return antwort({ ok: true, app: 'siegelrolle' });
}

function doPost(e) {
  let req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (x) {
    return antwort({ ok: false, error: 'bad_json' });
  }
  if (req.action === 'drops') {
    try {
      return antwort(drops(req));
    } catch (x) {
      return antwort({ ok: false, error: 'server', message: String(x) });
    }
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return antwort({ ok: false, error: 'busy' });
  try {
    switch (req.action) {
      case 'ping': return antwort({ ok: true, dm: istDm(req) });
      case 'save': return antwort(speichern(req));
      case 'get': return antwort(holen(req));
      case 'remove': return antwort(entfernen(req));
      case 'list': return antwort(liste(req));
      case 'roster': return antwort(gruppe());
      case 'force': return antwort(erzwingen(req));
      default: return antwort({ ok: false, error: 'unknown_action' });
    }
  } catch (x) {
    return antwort({ ok: false, error: 'server', message: String(x) });
  } finally {
    lock.releaseLock();
  }
}

function antwort(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function ordner() {
  const p = PropertiesService.getScriptProperties();
  const id = p.getProperty('ORDNER_ID');
  if (id) {
    try {
      const f = DriveApp.getFolderById(id);
      if (!f.isTrashed()) return f;
    } catch (x) {}
  }
  const it = DriveApp.getFoldersByName(ORDNER);
  const f = it.hasNext() ? it.next() : DriveApp.createFolder(ORDNER);
  p.setProperty('ORDNER_ID', f.getId());
  return f;
}

function datei(name) {
  const it = ordner().getFilesByName(name);
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed()) return f;
  }
  return null;
}

function lesen(name) {
  const f = datei(name);
  return f ? JSON.parse(f.getBlob().getDataAsString('UTF-8')) : null;
}

function schreiben(name, obj) {
  const s = JSON.stringify(obj);
  const f = datei(name);
  if (f) f.setContent(s);
  else ordner().createFile(name, s, 'application/json');
}

function hash(s) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8));
}

function gueltigeId(id) {
  return typeof id === 'string' && /^[a-z0-9]{6,40}$/i.test(id);
}

function istDm(req) {
  return DM_PASSWORT !== 'HIER-DEIN-PASSWORT' && DM_PASSWORT.length > 0 && req.dm === DM_PASSWORT;
}

function erzwungen() {
  return lesen('_erzwungen.json') || {};
}

function anzahl() {
  let n = 0;
  const it = ordner().getFiles();
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed() && f.getName().charAt(0) !== '_') n++;
  }
  return n;
}

function speichern(req) {
  if (!gueltigeId(req.id) || !req.key || !req.char) return { ok: false, error: 'bad_request' };
  if (JSON.stringify(req.char).length > 200000) return { ok: false, error: 'too_large' };
  const name = req.id + '.json';
  const alt = lesen(name);
  if (alt && alt.key !== hash(req.key)) return { ok: false, error: 'forbidden' };
  if (!alt && anzahl() >= MAX_CHARAKTERE) return { ok: false, error: 'full' };
  schreiben(name, { key: alt ? alt.key : hash(req.key), char: req.char, updated: Date.now() });
  return { ok: true, forced: erzwungen()[req.id] || null };
}

function holen(req) {
  if (!gueltigeId(req.id)) return { ok: false, error: 'bad_request' };
  const alt = lesen(req.id + '.json');
  if (!alt) return { ok: false, error: 'not_found', forced: erzwungen()[req.id] || null };
  if (alt.key !== hash(req.key)) return { ok: false, error: 'forbidden' };
  return { ok: true, char: alt.char, updated: alt.updated, forced: erzwungen()[req.id] || null };
}

function entfernen(req) {
  if (!gueltigeId(req.id)) return { ok: false, error: 'bad_request' };
  const f = datei(req.id + '.json');
  if (!f) return { ok: true };
  const alt = JSON.parse(f.getBlob().getDataAsString('UTF-8'));
  if (alt.key !== hash(req.key) && !istDm(req)) return { ok: false, error: 'forbidden' };
  f.setTrashed(true);
  return { ok: true };
}

function gruppe() {
  return { ok: true, chars: alleCharaktere(), forced: erzwungen() };
}

function liste(req) {
  if (!istDm(req)) return { ok: false, error: 'forbidden' };
  return { ok: true, chars: alleCharaktere(), forced: erzwungen() };
}

function alleCharaktere() {
  const out = [];
  const it = ordner().getFiles();
  while (it.hasNext()) {
    const f = it.next();
    const n = f.getName();
    if (f.isTrashed() || n.charAt(0) === '_' || n.slice(-5) !== '.json') continue;
    try {
      const o = JSON.parse(f.getBlob().getDataAsString('UTF-8'));
      out.push({ id: n.slice(0, -5), char: o.char, updated: o.updated });
    } catch (x) {}
  }
  return out;
}

function erzwingen(req) {
  if (!istDm(req)) return { ok: false, error: 'forbidden' };
  if (!gueltigeId(req.id)) return { ok: false, error: 'bad_request' };
  const m = erzwungen();
  if (req.value && typeof req.value === 'object' && JSON.stringify(req.value).length > 100000) return { ok: false, error: 'too_large' };
  m[req.id] = req.value && typeof req.value === 'object' ? req.value : { sub: null };
  schreiben('_erzwungen.json', m);
  return { ok: true, forced: m };
}

function dropsOrdner() {
  const it = DriveApp.getFoldersByName('Drops');
  let erster = null;
  while (it.hasNext()) {
    const f = it.next();
    if (f.isTrashed()) continue;
    if (!erster) erster = f;
    if (f.getFilesByName('Drops-Uebersicht').hasNext()) return f;
  }
  return erster;
}

function bloecke(body) {
  const out = [];
  const T = DocumentApp.ElementType;
  for (let i = 0; i < body.getNumChildren(); i++) {
    const el = body.getChild(i);
    const t = el.getType();
    if (t === T.TABLE) {
      const tb = el.asTable();
      const rows = [];
      for (let r = 0; r < tb.getNumRows(); r++) {
        const row = tb.getRow(r);
        const cs = [];
        for (let c = 0; c < row.getNumCells(); c++) cs.push(row.getCell(c).getText().trim());
        rows.push(cs);
      }
      out.push({ t: 'table', rows: rows });
    } else if (t === T.PARAGRAPH || t === T.LIST_ITEM) {
      const s = el.getText().trim();
      if (!s) continue;
      out.push({ t: String(el.getHeading()), s: s });
    }
  }
  return out;
}

function drops(req) {
  if (!istDm(req)) return { ok: false, error: 'forbidden' };
  const start = Date.now();
  const ordnerD = dropsOrdner();
  if (!ordnerD) return { ok: false, error: 'no_folder' };
  const cache = lesen('_drops-cache.json') || {};
  const neu = {};
  let geaendert = false;
  let mehr = false;
  const it = ordnerD.getFilesByType(MimeType.GOOGLE_DOCS);
  while (it.hasNext()) {
    const f = it.next();
    const name = f.getName();
    if (f.isTrashed() || name.indexOf('Drops-') !== 0 || name === 'Drops-Uebersicht') continue;
    const id = f.getId();
    const u = f.getLastUpdated().getTime();
    if (cache[id] && cache[id].u === u) {
      neu[id] = cache[id];
      continue;
    }
    if (Date.now() - start > 20000) {
      mehr = true;
      continue;
    }
    neu[id] = { u: u, n: name, b: bloecke(DocumentApp.openById(id).getBody()) };
    geaendert = true;
  }
  if (geaendert || Object.keys(neu).length !== Object.keys(cache).length) schreiben('_drops-cache.json', neu);
  const docs = Object.keys(neu).map(function (id) { return { id: id, n: neu[id].n, b: neu[id].b }; });
  return { ok: true, docs: docs, more: mehr };
}
