import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const resource = await readFile(new URL("../app/modules/resource-center/ResourceCenterModule.tsx", import.meta.url), "utf8");
const navigation = await readFile(new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url), "utf8");
const dashboard = await readFile(new URL("../app/components/dashboard/Dashboard.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");
const curriculum = await readFile(new URL("../app/data/curriculum.ts", import.meta.url), "utf8");

test("Kaynak Merkezi kanonik müfredat verisini ayrı modülde kullanır", () => {
  assert.match(navigation, /"resources", "Kaynak Merkezi"/);
  assert.match(page, /<ResourceCenterModule units=\{units\}/);
  assert.match(resource, /TYMM Kaynak Merkezi/);
  assert.match(resource, /unit\.outcomes\.map/);
  assert.match(resource, /outcome\.processComponents\.map/);
  assert.doesNotMatch(resource, /fetch\(|localStorage|sessionStorage/);
});

test("müfredat ve öğrenme çıktıları aranıp sınıfa göre süzülür", () => {
  assert.match(resource, /toLocaleLowerCase\("tr-TR"\)/);
  assert.match(resource, /grade !== "all" && unit\.grade !== grade/);
  assert.match(resource, /unit\.contentFramework/);
  assert.match(resource, /unit\.competencyFramework\.values/);
  assert.match(resource, /unit\.competencyFramework\.literacy/);
  assert.match(dashboard, /\{label:"Müfredat",ready:true\}/);
  assert.match(dashboard, /\{label:"Öğrenme Çıktıları",ready:true\}/);
});

test("öğrenme çıktılarında doğrulanmış tam ifadeler kullanılır", () => {
  assert.match(curriculum, /description: enrichmentOutcome\?\.description \?\? outcome\.description/);
  assert.match(curriculum, /Din felsefesinin konusunu, kavramlarını ve problemlerini muhakeme edebilme/);
});

test("BEP rehberi tanı üretmeden çıktıyı koruyan uyarlamalar sunar", () => {
  assert.match(resource, /BEP rehberi/);
  assert.match(resource, /Çıktıyı koru, erişim engelini azalt/);
  assert.match(resource, /Gözlenebilir ihtiyaç/);
  assert.match(resource, /BEP geliştirme birimi kararının yerine geçmez/);
  assert.match(resource, /öğrenci adı, tanı, sağlık bilgisi veya bireysel BEP belgesi girilmez/);
  assert.match(dashboard, /\{label:"BEP",ready:true\}/);
  assert.match(dashboard, /item\.label==="BEP"\?"bep":item\.label==="Örnek Belgeler"\?"documents":"curriculum"/);
  assert.match(page, /initialSection=\{resourceSection\}/);
});

test("örnek belgeler güvenli şablon yapısını ilgili modüllere bağlar", () => {
  assert.match(resource, /Örnek belgeler/);
  assert.match(resource, /Günlük ders planı/);
  assert.match(resource, /Zümre toplantı tutanağı/);
  assert.match(resource, /Sınav analiz tutanağı/);
  assert.match(resource, /onOpen\(document\.target\)/);
  assert.match(resource, /Yönetici onayı, toplantı kararı, imza veya gerçekleşmiş uygulama otomatik üretilmez/);
  assert.match(dashboard, /\{label:"Örnek Belgeler",ready:true\}/);
  assert.match(page, /onOpen=\{\(next\)=>\{setView\(next\);setResult\(null\)\}\}/);
});
